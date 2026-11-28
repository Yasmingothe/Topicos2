# Trabalho 06: Autenticação e Autorização com Keycloak

## Como rodar

**1. Subir o Keycloak e o Mailpit** (na pasta raiz do projeto, onde fica o `docker-compose.yml`):

```bash
docker compose up -d
```

Espere uns 30 segundos e abra http://localhost:8180. O console de administração entra com usuário `admin` e senha `admin`.
O realm **armas** já vem pronto, com os papéis, os clients e os usuários de teste. Ele é importado do arquivo `keycloak/armas-realm.json`.
O **Mailpit** é uma caixa de e-mail de teste: os e-mails do "Esqueci minha senha" aparecem em http://localhost:8025 (não vão para a internet).

**2. Subir o Postgres** (o container `armas-postgres` de sempre).

**3. Subir o back-end**, sempre **depois** do Keycloak:

```bash
cd armas-backend
./mvnw quarkus:dev
```

**4. Subir o front-end:**

```bash
cd armas-frontend
npm start
```

**Contas de teste:**

| E-mail | Senha | Papel |
|---|---|---|
| admin@zero1.com | admin123 | ADMIN |
| carlos@email.com | 123456 | CLIENTE |
| maria@email.com | 123456 | CLIENTE |
| lucas@email.com | 123456 | CLIENTE |

## Glossário rápido

- **Keycloak** = o "cartório" de usuários. Ele guarda as senhas, confere o login e gera os tokens.
- **Realm** = um espaço separado dentro do Keycloak, como se fosse um "condomínio". O nosso se chama `armas`.
- **Client** = um sistema que tem permissão de pedir coisas ao Keycloak. Temos dois:
  - `armas-backend` = o Quarkus fazendo o **login** dos usuários (troca e-mail + senha por token).
  - `armas-admin` = o Quarkus como "robô" que **cadastra usuários**, dá papéis e desativa contas (Admin API).
- **Role (papel)** = o que a pessoa pode fazer. **ADMIN** entra no painel. **CLIENTE** compra na loja.
- **Mailpit** = caixa de e-mail "de mentira" para testes: pega os e-mails que o sistema manda e mostra numa página.
- **Access token** = o "crachá" que o Angular manda em toda requisição (`Authorization: Bearer ...`). Vale **5 minutos**.
- **Refresh token** = o "vale-crachá": serve para pegar um crachá novo sem digitar a senha de novo.
- **OAuth 2.0 / OpenID Connect (OIDC)** = as regras (protocolo) que o Keycloak usa para fazer login e gerar tokens.
- **401 Unauthorized** = "não sei quem você é": não está logado ou o token venceu.
- **403 Forbidden** = "sei quem você é, mas você não pode": ex.: um CLIENTE tentando abrir uma rota de ADMIN.

## Como o login funciona

```
Angular ──(e-mail, senha)──> Quarkus /auth/login ──(grant password + client secret)──> Keycloak
Angular <──(token, refreshToken, usuário)── Quarkus <──────────(tokens)────────────── Keycloak

Angular ──(Authorization: Bearer token)──> Quarkus /produtos, /minha-conta...
                                           └─ o quarkus-oidc confere a assinatura do token
                                              com as chaves públicas do Keycloak e lê os papéis
```

O Angular **nunca** fala com o Keycloak e **não** guarda nenhuma credencial dele. Os *client secrets* ficam só no `application.properties` do back.

## Onde cada requisito foi feito

| Requisito | Onde está |
|---|---|
| 1. Realm, Clients e Roles | `keycloak/armas-realm.json` (realm `armas`, clients `armas-backend` e `armas-admin`, papéis `ADMIN` e `CLIENTE`) + `docker-compose.yml` |
| 2. Login pelo Angular via back | `POST /auth/login` → `AuthServiceImpl.login` → `KeycloakService.entrar` (OIDC, grant *password*) |
| 3. Cadastro integrado ao Keycloak | `POST /auth/cadastro` cria o usuário no Keycloak (com o papel CLIENTE) e no nosso banco **sem senha**, ligado pelo `keycloakId`. O admin também cria usuários pelo painel (`UsuarioServiceImpl.create`) |
| 4. Usuário autenticado e estado no Angular | `GET /auth/eu` + `UsuarioLogado` (acha o usuário pelo `sub` do token). No Angular: `AuthService` com *signals* (`logado`, `ehAdmin`, `ehCliente`) e `conferirSessao()` ao abrir o site |
| 5. Papéis ADMIN e CLIENTE | Realm roles no Keycloak → lidos de `realm_access.roles` (`quarkus.oidc.roles.role-claim-path`) |
| 6. Proteção dos endpoints | `quarkus-oidc` + `@RolesAllowed("ADMIN")`, `@RolesAllowed("CLIENTE")` e `@PermitAll` nos resources |
| 7. Guards no Angular | `guards/auth.guard.ts`: `adminGuard`, `clienteGuard`, `visitanteGuard`, `naoAdminGuard` (usados no `app.routes.ts`) |
| 8. Logout | `POST /auth/logout` → o Keycloak encerra a sessão e o refresh token deixa de valer. O Angular limpa o `localStorage`. Quando o admin desativa um usuário, as sessões dele também são derrubadas |
| Extra: trocar senha | Aba **Senha** em Minha conta → `PUT /auth/senha`: o back confere a senha atual com o Keycloak e troca lá pela Admin API (`KeycloakService.definirSenha`) |
| Extra: esqueci minha senha | Link na tela de login → `POST /auth/esqueci-senha` gera um código (tabela `RecuperacaoSenha`, vale 30 min e só pode ser usado uma vez) e manda um e-mail pelo `quarkus-mailer`. O link abre `/redefinir-senha` no Angular → `POST /auth/redefinir-senha` troca a senha no Keycloak e derruba as sessões antigas |
| HttpInterceptor | `interceptors/auth.interceptor.ts`: coloca o token; no 401 renova pelo `/auth/renovar` e repete a requisição; no 403 mostra o aviso |
| Senha fora do banco | A coluna `senha` saiu da tabela `usuario`. Saíram também `SenhaService`, `JwtService` e as chaves `.pem` |
| Erros 401 e 403 | `TratadorDeErros`: devolve JSON com a mensagem (401, 403 e 503 quando o Keycloak está fora do ar) |

## Testes rápidos para a apresentação

1. Entrar como **admin@zero1.com**. Deve abrir o painel.
2. Entrar como **carlos@email.com** e tentar abrir `http://localhost:4200/admin`. O guard bloqueia e volta para a loja.
3. Chamar a API sem token, por exemplo `curl -i http://localhost:8080/usuarios`. Resposta: **401**.
4. Logado como cliente, chamar `/usuarios` com o token dele. Resposta: **403**.
5. Criar uma conta nova na loja. Ela aparece no console do Keycloak em *Users*, com o papel CLIENTE.
6. Clicar em **Sair** e ver no console do Keycloak, em *Sessions*, que a sessão sumiu.
7. Como admin, desativar um cliente: ele não consegue mais entrar.
8. Como cliente, ir em **Minha conta → Senha** e trocar a senha. Depois, sair e entrar com a senha nova.
9. Na tela de login, clicar em **Esqueci minha senha** e informar `maria@email.com`. Abrir http://localhost:8025, abrir o e-mail, clicar em **Criar nova senha**, definir a nova e entrar com ela.

## Observações

- O banco usa `drop-and-create`, mas os usuários que você cria ficam guardados no Keycloak. No primeiro login depois de reiniciar, o back recria o usuário no banco sozinho (`AuthServiceImpl.sincronizar`).
- O grant *password* (Direct Access Grants) foi usado porque o trabalho pede que o **back** faça a autenticação, e não o Angular. Por isso ele está ligado só no client confidencial `armas-backend`, que tem secret.
- Se mudar o realm, para reimportar: `docker compose down && docker compose up -d`. A importação só acontece quando o realm ainda não existe.

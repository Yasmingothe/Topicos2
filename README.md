# ZERO1 - Loja de Armas & Acessórios

Projeto Full-Stack com backend em **Quarkus 3.40.1** (Java 21, Hibernate Panache, PostgreSQL) e frontend em **Angular 22** (Angular Material).

Este repositório foi migrado da autenticação JWT própria para autenticação federada com **Keycloak 26 (OpenID Connect / OAuth2)** com fluxo **Authorization Code + PKCE (S256)** no frontend e proteção via **Bearer Token** no backend.

---

## 1. Arquitetura de Autenticação e Decisões Técnicas

### 1.1 Keycloak (OIDC / OAuth2)
- **Realm:** `zero1`
- **Clients:**
  - `armas-frontend`: Client público SPA (Angular) com fluxo Authorization Code e extensão PKCE (`S256`). Direct Access Grants habilitado em dev para testes via curl. Redirecionamento configurado para `http://localhost:4200/*`.
  - `armas-backend`: Client de serviço (bearer-only) protegido pela extensão `quarkus-oidc`.
- **Roles:** `ADMIN` e `CLIENTE` atribuídas como Realm Roles. A role `CLIENTE` é atribuída automaticamente como padrão para novos usuários auto-registrados.
- **Importação Reproduzível:** O arquivo `keycloak/realm-zero1.json` define a infraestrutura completa do realm e é importado automaticamente pelo Keycloak na inicialização via `--import-realm`.

### 1.2 Resolução de Usuário e Ponto Crítico (`sub` UUID vs `Long id_usuario`)
- No Keycloak, o claim `sub` (Subject) é um UUID (ex.: `e0000000-0000-0000-0000-000000000001`), enquanto o banco de dados da aplicação relaciona as tabelas (`cliente`, `pedido`) por `id_usuario (Long)`.
- **Solução implementada (`UsuarioLogadoHelper`):**
  - Adicionado o campo `keycloak_id` (String único e indexado) na entidade `Usuario`.
  - Os usuários de teste (`admin`, `carlos`, `maria`, `lucas`) possuem o mesmo UUID fixado tanto no `realm-zero1.json` quanto no `import.sql`.
  - O helper central `UsuarioLogadoHelper`:
    1. Lê o `JsonWebToken` injetado pelo Quarkus OIDC.
    2. Busca o `Usuario` local pelo `keycloakId` ou pelo `email`.
    3. Para novos cadastros feitos pelo Keycloak, realiza **Provisionamento Just-In-Time (JIT)**, criando o registro local com o perfil mapeado das roles do token.
    4. Fornece `getIdUsuarioLogado()` (`Long`), preservando todas as foreign keys e regras de negócio de `cliente`, `pedido` e `usuario` sem quebras.

### 1.3 Remoção de Senhas Locais e Decisão de `UsuarioResource`
- As senhas deixaram de existir no banco de dados da aplicação: `SenhaService.java` e a coluna `senha` foram completamente removidos.
- **Decisão sobre `UsuarioResource`:** Manteve-se o controle local de status ativo/inativo (`PATCH /usuarios/{id}/ativar` e `/desativar`) e listagem (`GET /usuarios`), removendo o cadastro local de senhas. A criação de usuários e gestão de credenciais é delegada ao Keycloak (auto-registro e console administrativo).

### 1.4 Endpoints Públicos e `@PermitAll`
- Os endpoints de catálogo e suporte (`CategoriaResource`, `EstadoResource`, `OpcaoResource`, além dos métodos GET de `ProdutoResource` e `MarcaResource`) foram anotados explicitamente com `@PermitAll`. Isso garante transparência e compatibilidade caso seja ativado o bloqueio de endpoints sem anotação (`quarkus.security.jaxrs.deny-unannotated-endpoints=true`).

---

## 2. Usuários de Teste

| Usuário | E-mail | Senha | Realm Role | Perfil na Loja |
|---|---|---|---|---|
| **Administrador** | `admin@zero1.com` | `admin123` | `ADMIN` | Administrador completo |
| **Carlos Mendes** | `carlos@email.com` | `123456` | `CLIENTE` | Cliente (36 anos, autorização de compra APROVADA) |
| **Maria Souza** | `maria@email.com` | `123456` | `CLIENTE` | Cliente (autorização NÃO ENVIADA) |
| **Lucas Pereira** | `lucas@email.com` | `123456` | `CLIENTE` | Cliente (22 anos, menor de 25 anos) |

---

## 3. Como Subir o Projeto

### Pré-requisitos
- Docker e Docker Compose
- Java 21 e Apache Maven
- Node.js (v20+) e npm

### Passo 1: Subir a Infraestrutura (Banco + Keycloak)
Na raiz do repositório:
```bash
docker compose up -d
```
Os seguintes serviços subirão:
- **armas-postgres**: PostgreSQL na porta `5432` (`topicos2db`)
- **keycloak-postgres**: PostgreSQL dedicado para o Keycloak
- **keycloak-zero1**: Keycloak 26 na porta `8180` com o realm `zero1` pré-carregado

Verifique se o Keycloak subiu:
```bash
docker logs keycloak-zero1 --tail 20
```

### Passo 2: Subir o Backend (Quarkus)
Em outro terminal, acesse a pasta do backend:
```bash
cd armas-backend
mvn quarkus:dev
```
A API REST estará acessível em `http://localhost:8080`.

### Passo 3: Subir o Frontend (Angular)
Em outro terminal, acesse a pasta do frontend:
```bash
cd armas-frontend
npm install
npm start
```
O frontend estará acessível em `http://localhost:4200`.

---

## 4. Testes dos Cenários via `curl`

Para os comandos abaixo no Windows PowerShell, utilize `curl.exe`.

### Obtenção de Tokens de Acesso (Direct Access Grants):

**Token de CLIENTE (`carlos@email.com`):**
```bash
curl.exe -s -X POST "http://localhost:8180/realms/zero1/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=armas-frontend&grant_type=password&username=carlos@email.com&password=123456"
```

**Token de ADMIN (`admin@zero1.com`):**
```bash
curl.exe -s -X POST "http://localhost:8180/realms/zero1/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=armas-frontend&grant_type=password&username=admin@zero1.com&password=admin123"
```

---

### Execução dos 4 Cenários Obrigatórios:

#### Cenário 1: Rota pública (Esperado: 200 OK)
```bash
curl.exe -i http://localhost:8080/produtos
```
*Retorno: HTTP/1.1 200 OK com a listagem pública de produtos da vitrine.*

#### Cenário 2: Rota protegida sem token (Esperado: 401 Unauthorized)
```bash
curl.exe -i http://localhost:8080/minha-conta/cliente
```
*Retorno: HTTP/1.1 401 Unauthorized.*

#### Cenário 3: Rota de ADMIN chamada por usuário CLIENTE (Esperado: 403 Forbidden)
```bash
# Substitua <TOKEN_CLIENTE> pelo token obtido de carlos@email.com
curl.exe -i -H "Authorization: Bearer <TOKEN_CLIENTE>" http://localhost:8080/usuarios
```
*Retorno: HTTP/1.1 403 Forbidden.*

#### Cenário 4: Rota de ADMIN chamada por usuário ADMIN (Esperado: 200 OK)
```bash
# Substitua <TOKEN_ADMIN> pelo token obtido de admin@zero1.com
curl.exe -i -H "Authorization: Bearer <TOKEN_ADMIN>" http://localhost:8080/usuarios
```
*Retorno: HTTP/1.1 200 OK com a listagem de usuários.*

---

## 5. Variáveis de Ambiente

As variáveis de ambiente estão parametrizadas e documentadas em `.env.example`:

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_HOST` | `localhost` | Host do banco PostgreSQL |
| `DB_PORT` | `5432` | Porta do banco de dados |
| `DB_NAME` | `topicos2db` | Nome da base de dados |
| `DB_USER` | `topicos2` | Usuário do banco de dados |
| `DB_PASSWORD` | `123456` | Senha do banco de dados |
| `KEYCLOAK_URL` | `http://localhost:8180` | URL do servidor Keycloak |
| `KEYCLOAK_REALM` | `zero1` | Nome do Realm |
| `BACKEND_CLIENT_ID` | `armas-backend` | Client ID OIDC da API Quarkus |
| `FRONTEND_CLIENT_ID` | `armas-frontend` | Client ID público do Angular |

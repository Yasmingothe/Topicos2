# ZERO1: o que mudou

## Como rodar (igual antes)

1. Abra o Docker e rode `docker start armas-postgres`
2. Back: `cd armas-backend` e depois `./mvnw quarkus:dev`
   - Na primeira vez ele baixa as bibliotecas novas do login (JWT). Demora um pouco mais, é normal.
3. Front: `cd armas-frontend` e depois `ng serve`
4. Abra http://localhost:4200

O banco é recriado toda vez que o back sobe (`drop-and-create`), com os dados do `import.sql`.

## Contas de teste

| E-mail | Senha | Para que serve |
|---|---|---|
| admin@zero1.com | admin123 | Entrar no painel |
| carlos@email.com | 123456 | Cliente com autorização aprovada: compra arma normalmente |
| maria@email.com | 123456 | Cliente sem autorização: arma é bloqueada, acessório passa |
| lucas@email.com | 123456 | Cliente de 22 anos com autorização em análise: bloqueado pela idade |

Na tela de login tem um atalho: clique na conta e ela já preenche.

## O que tem de novo

**Login**
- **Login com JWT** = ao entrar, o back devolve um token (o "crachá") e o front manda ele em toda requisição
- **Senha com hash** = a senha nunca fica salva de verdade no banco, só um código que não dá para desfazer
- **Perfis** = ADMIN entra no painel, CLIENTE compra na loja. O back bloqueia com `@RolesAllowed`
- **Guards** = o front não deixa abrir `/admin` sem ser admin, nem o checkout sem estar logado
- **Sair** = agora funciona, no painel e na loja

**Estoque (o que o professor pediu)**
- **Fornecedores** = quem emite as notas
- **Nota fiscal de entrada** = número, série, fornecedor, data de emissão, data de entrada e os produtos
- **Lote** = cada produto da nota vira um lote. O estoque do produto é a soma dos lotes
- **Estoque não é mais digitado** = o campo saiu do cadastro de produto. Sobe pela nota e desce pela venda
- **Venda tira do lote mais antigo primeiro** = e grava de qual lote saiu cada unidade
- **Rastreio de lote** = escolhe um lote e vê de qual nota veio e para quais clientes foi vendido (o exemplo da farmácia)
- **Nota não se edita** = documento fiscal. Se errar, exclui (só se nada dela foi vendido) e lança de novo

**Venda de produto controlado (simplificado)**
- **Arma e munição** = exigem autorização de compra APROVADA e dentro da validade, e cliente com 25 anos ou mais
- **Acessório e óptica** = venda livre
- **Autorização de compra** = o cliente informa número e validade em Minha conta. O admin aprova ou recusa na lista de Clientes
- **A regra fica no back** = o front avisa antes, mas quem decide é o `PedidoServiceImpl`. Mesmo burlando o front, o back recusa

**Loja**
- Catálogo com busca, categorias e filtro por marca
- Página do produto, carrinho (fica salvo no navegador), checkout com pagamento simulado (PIX, cartão ou boleto)
- Criar conta, Minha conta (dados com ViaCEP e autorização) e Meus pedidos (pode cancelar enquanto estiver "Pago")

**Painel**
- Dashboard novo, com o caminho nota → lote → venda
- Pedidos: lista, detalhe e mudança de situação (Pago → Em separação → Pronto para retirada → Entregue). Cancelar devolve as unidades para os mesmos lotes
- Usuários: criar outro admin, ativar e desativar
- Produto: envio de foto (fica na pasta `armas-imagens` dentro da sua pasta de usuário). Sem foto, aparece o desenho da categoria

## Fotos dos produtos

As fotos foram geradas por IA, todas no mesmo estilo (fundo preto com brilho vermelho).
Elas já vêm dentro do projeto, na pasta do back:

`armas-backend/src/main/resources/META-INF/resources/fotos/`

O Quarkus serve essa pasta sozinho, em `http://localhost:8080/fotos/produto-2.jpg`, e o `import.sql`
já liga cada produto à sua foto. Não precisa copiar nada.

Para trocar uma foto, substitua o arquivo `produto-N.jpg` nessa pasta (mesmo nome) e reinicie o back.

Para um produto novo, use **Enviar foto** ou **Link da foto** na tela de editar produto.

## Roteiro para a apresentação (uns 5 minutos)

1. **Loja sem login**: mostre o catálogo e uma pistola. Aponte o aviso de produto controlado
2. **Entre como maria@email.com** e tente comprar a Pistola Glock 17. O checkout avisa, e ao confirmar o back recusa com a mensagem da regra
3. Ainda como Maria, troque por um **coldre**: a compra passa (venda livre)
4. **Entre como admin**: no dashboard, mostre o caminho nota → lote → venda
5. Em **Notas de entrada**, lance uma nota nova da Pistola Glock 17. Mostre que o estoque subiu e o lote apareceu
6. Em **Rastreio de lotes**, abra o lote `TAU-PT24-2609A`: entrada pela NF 104582 e venda de 2 unidades para o Carlos
7. Em **Clientes**, aprove a autorização do Lucas. Depois, entrando como Lucas, mostre que a arma continua bloqueada pela idade (22 anos)

## Onde está cada coisa

**Back (armas-backend)**
- `model/`: Usuario, Perfil, Fornecedor, NotaEntrada, ItemNotaEntrada, Lote, Pedido, ItemPedido, SaidaLote
- `service/PedidoServiceImpl.java`: as 3 regras de venda e a baixa por lote
- `service/NotaEntradaServiceImpl.java`: a entrada de estoque e a criação dos lotes
- `service/SenhaService.java` e `service/JwtService.java`: senha com hash e geração do token
- `resource/MinhaContaResource.java`: tudo do cliente logado (o id vem do token, nunca da URL)
- `resources/privateKey.pem` e `publicKey.pem`: chaves do JWT (a privada assina, a pública confere)

**Front (armas-frontend)**
- `layouts/`: a moldura do painel e a da loja
- `services/auth.service.ts`, `interceptors/auth.interceptor.ts`, `guards/auth.guard.ts`: o login
- `services/carrinho.service.ts`: o carrinho
- `components/loja/`: as telas da loja
- `components/notas/`, `lotes/`, `pedidos/`, `fornecedores/`, `usuarios/`: as telas novas do painel

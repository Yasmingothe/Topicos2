-- marcas que aparecem nos prototipos
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Taurus', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('CBC', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Glock', 'Áustria', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Bushnell', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Condor', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Remington', 'Estados Unidos', true, NOW());

-- produtos (ids das marcas: 1 Taurus, 2 CBC, 3 Glock, 4 Bushnell, 5 Condor, 6 Remington)
-- imagemUrl: as fotos ficam no próprio back, em src/main/resources/META-INF/resources/fotos
-- (o Quarkus serve essa pasta em http://localhost:8080/fotos/...)
-- o calibre fica so no campo calibre, nao no nome
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Pistola Taurus PT 24/7', 1, 'PISTOLA', '9mm', 3890.00, 12, 'Pistola em polímero com ação dupla, carregador de 17 tiros.', true, 'http://localhost:8080/fotos/produto-1.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Revólver Taurus Modelo 82', 1, 'REVOLVER', '.38', 4250.00, 5, 'Revólver de 6 tiros, cano de 4 polegadas.', true, 'http://localhost:8080/fotos/produto-2.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Espingarda Remington 870', 6, 'ESPINGARDA', '12', 3190.00, 7, 'Espingarda de repetição por ação de bombeamento.', true, 'http://localhost:8080/fotos/produto-3.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Rifle Remington 700 SPS Tactical', 6, 'RIFLE_CARABINA', '.308', 6890.00, 4, 'Rifle de ferrolho para tiro de precisão.', true, 'http://localhost:8080/fotos/produto-4.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Pistola Glock 17', 3, 'PISTOLA', '9mm', 5490.00, 3, 'Pistola de uso esportivo em polímero.', true, 'http://localhost:8080/fotos/produto-5.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Mira 3-9x40', 4, 'ACESSORIO_OPTICA', NULL, 890.00, 2, 'Luneta com aumento de 3 a 9 vezes.', true, 'http://localhost:8080/fotos/produto-6.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Coldre Tático Kydex IWB', 5, 'ACESSORIO_OPTICA', NULL, 320.00, 6, 'Coldre de uso interno em Kydex.', true, 'http://localhost:8080/fotos/produto-7.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Munição .38 Special - caixa com 50', 2, 'MUNICAO', '.38', 189.90, 4, 'Caixa com 50 cartuchos.', true, 'http://localhost:8080/fotos/produto-8.jpg', NOW());

-- os 27 estados (26 + Distrito Federal)
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Acre', 'AC', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Alagoas', 'AL', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Amapá', 'AP', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Amazonas', 'AM', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Bahia', 'BA', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Ceará', 'CE', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Distrito Federal', 'DF', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Espírito Santo', 'ES', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Goiás', 'GO', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Maranhão', 'MA', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Mato Grosso', 'MT', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Mato Grosso do Sul', 'MS', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Minas Gerais', 'MG', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Pará', 'PA', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Paraíba', 'PB', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Paraná', 'PR', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Pernambuco', 'PE', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Piauí', 'PI', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Rio de Janeiro', 'RJ', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Rio Grande do Norte', 'RN', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Rio Grande do Sul', 'RS', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Rondônia', 'RO', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Roraima', 'RR', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Santa Catarina', 'SC', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('São Paulo', 'SP', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Sergipe', 'SE', NOW());
INSERT INTO estado (nome, sigla, dataCadastro) VALUES ('Tocantins', 'TO', NOW());


-- municipio e clientes de exemplo (estado 25 = Sao Paulo)
INSERT INTO municipio (nome, id_estado, dataCadastro) VALUES ('São Paulo', 25, NOW());
INSERT INTO cliente (nome, email, cpf, dataNascimento, telefone, cep, logradouro, numero, complemento, bairro, id_municipio, situacaoAutorizacao, dataCadastro) VALUES ('Maria Souza', 'maria@email.com', '52998224725', '1995-03-10', '63999990000', '01001000', 'Praça da Sé', '100', NULL, 'Sé', 1, 'NAO_ENVIADA', NOW());
INSERT INTO cliente (nome, email, cpf, dataNascimento, telefone, cep, logradouro, numero, complemento, bairro, id_municipio, situacaoAutorizacao, dataCadastro) VALUES ('João Pereira', 'joao@email.com', '11144477735', '1990-06-15', '63988887777', '01001000', 'Praça da Sé', '250', NULL, 'Sé', 1, 'NAO_ENVIADA', NOW());

-- ===== USUÁRIOS (a senha está guardada como hash) =====
-- admin@zero1.com / admin123   |   clientes: senha 123456
INSERT INTO usuario (nome, email, senha, perfil, ativo, dataCadastro) VALUES ('Yasmin Gothe', 'admin@zero1.com', 'pbkdf2$120000$HjGcneJ/lAjX3kv28Xa5eQ==$9tEulHvu8afEUfEevS/ucNQ7fgcZi2403guBQTKX3Q0=', 'ADMIN', true, NOW());
INSERT INTO usuario (nome, email, senha, perfil, ativo, dataCadastro) VALUES ('Carlos Mendes', 'carlos@email.com', 'pbkdf2$120000$v3kzvLtGnCuhZczRRtQbyA==$Ezx66xM2rrszOoiHVoI8A1RKkHGwar/O8M4huV9IVEA=', 'CLIENTE', true, NOW());
INSERT INTO usuario (nome, email, senha, perfil, ativo, dataCadastro) VALUES ('Maria Souza', 'maria@email.com', 'pbkdf2$120000$XR3YUs+hiO6nlIHFJzR/CQ==$SGK+QCpyU/RG/vPtXWsa4xtKcB+/Zv899nAoKmIDZgk=', 'CLIENTE', true, NOW());
INSERT INTO usuario (nome, email, senha, perfil, ativo, dataCadastro) VALUES ('Lucas Pereira', 'lucas@email.com', 'pbkdf2$120000$KDZVRoXF17J+tiwGwxAiQg==$legTrDawq0epJjYc8n/ldiKut50mvSSUTPQlyKYNMGY=', 'CLIENTE', true, NOW());

-- Maria (cliente 1) ganha a conta de login 3 e ainda NÃO enviou autorização -> arma é bloqueada
UPDATE cliente SET id_usuario = 3 WHERE id = 1;

-- Carlos (cliente 3): 36 anos, autorização APROVADA -> pode comprar arma
INSERT INTO municipio (nome, id_estado, dataCadastro) VALUES ('Palmas', 27, NOW());
INSERT INTO cliente (nome, email, cpf, dataNascimento, telefone, cep, logradouro, numero, complemento, bairro, id_municipio, id_usuario, numeroAutorizacao, validadeAutorizacao, situacaoAutorizacao, dataCadastro) VALUES ('Carlos Mendes', 'carlos@email.com', '52601815906', '1990-05-14', '63984420011', '77001002', 'Quadra 104 Norte Rua NE 5', '12', 'Sala 3', 'Plano Diretor Norte', 2, 2, 'PF-2026/004512', '2027-05-14', 'APROVADA', NOW());

-- Lucas (cliente 4): 22 anos, autorização aprovada, mas é MENOR de 25 -> arma é bloqueada pela idade
INSERT INTO cliente (nome, email, cpf, dataNascimento, telefone, cep, logradouro, numero, complemento, bairro, id_municipio, id_usuario, numeroAutorizacao, validadeAutorizacao, situacaoAutorizacao, dataCadastro) VALUES ('Lucas Pereira', 'lucas@email.com', '08301661305', '2004-02-20', '63992215544', '77020012', 'Quadra 106 Sul Alameda 2', '45', NULL, 'Plano Diretor Sul', 2, 4, 'PF-2026/007788', '2027-01-30', 'EM_ANALISE', NOW());

-- ===== FORNECEDORES =====
INSERT INTO fornecedor (razaoSocial, nomeFantasia, cnpj, email, telefone, ativo, dataCadastro) VALUES ('Taurus Armas S.A.', 'Taurus', '07112543000140', 'vendas@taurus.exemplo.com', '5132920000', true, NOW());
INSERT INTO fornecedor (razaoSocial, nomeFantasia, cnpj, email, telefone, ativo, dataCadastro) VALUES ('Companhia Brasileira de Cartuchos', 'CBC', '57101548000145', 'comercial@cbc.exemplo.com', '1141221000', true, NOW());
INSERT INTO fornecedor (razaoSocial, nomeFantasia, cnpj, email, telefone, ativo, dataCadastro) VALUES ('Distribuidora Tática Brasil Ltda', 'Tática BR', '33451287000125', 'pedidos@taticabr.exemplo.com', '6232150000', true, NOW());

-- ===== NOTAS FISCAIS DE ENTRADA, ITENS E LOTES =====
-- (o estoque de cada produto lá em cima = soma do que sobrou nos lotes)
INSERT INTO nota_entrada (numero, serie, id_fornecedor, dataEmissao, dataEntrada, observacao, dataCadastro) VALUES ('104582', '1', 1, '2026-09-10', '2026-09-12', 'Primeira compra do mês.', NOW());
INSERT INTO nota_entrada (numero, serie, id_fornecedor, dataEmissao, dataEntrada, observacao, dataCadastro) VALUES ('88213', '1', 2, '2026-09-20', '2026-09-22', NULL, NOW());
INSERT INTO nota_entrada (numero, serie, id_fornecedor, dataEmissao, dataEntrada, observacao, dataCadastro) VALUES ('5521', '2', 3, '2026-10-05', '2026-10-06', 'Importados.', NOW());

-- nota 1
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (1, 1, 10, 2800.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (1, 2, 5, 3100.00, NOW());
-- nota 2
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (2, 3, 7, 2300.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (2, 4, 4, 1900.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (2, 8, 10, 120.00, NOW());
-- nota 3
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (3, 5, 3, 4100.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (3, 6, 3, 560.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (3, 7, 6, 180.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (3, 1, 4, 2850.00, NOW());

-- um lote para cada item (quantidadeDisponivel já descontando as vendas abaixo)
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-PT24-2609A', 1, 1, '2026-09-12', 10, 8, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-M82-2609', 2, 2, '2026-09-12', 5, 5, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('REM-870-0922', 3, 3, '2026-09-22', 7, 7, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('REM-700-0922', 4, 4, '2026-09-22', 4, 4, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-38SPL-0922', 8, 5, '2026-09-22', 10, 4, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('GLK-G17-1006', 5, 6, '2026-10-06', 3, 3, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('BSH-3940-1006', 6, 7, '2026-10-06', 3, 2, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CND-KYDEX-1006', 7, 8, '2026-10-06', 6, 6, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-PT24-2610B', 1, 9, '2026-10-06', 4, 4, NOW());

-- ===== PEDIDOS (vendas) DO CARLOS (cliente 3) =====
INSERT INTO pedido (id_cliente, data, situacao, formaPagamento, parcelas, valorTotal, dataCadastro) VALUES (3, '2026-10-10 14:32:00', 'ENTREGUE', 'PIX', 1, 8919.40, NOW());
INSERT INTO pedido (id_cliente, data, situacao, formaPagamento, parcelas, valorTotal, dataCadastro) VALUES (3, '2026-10-18 09:15:00', 'PAGO', 'CARTAO_CREDITO', 3, 890.00, NOW());

INSERT INTO item_pedido (id_pedido, id_produto, quantidade, precoUnitario, dataCadastro) VALUES (1, 1, 2, 3890.00, NOW());
INSERT INTO item_pedido (id_pedido, id_produto, quantidade, precoUnitario, dataCadastro) VALUES (1, 8, 6, 189.90, NOW());
INSERT INTO item_pedido (id_pedido, id_produto, quantidade, precoUnitario, dataCadastro) VALUES (2, 6, 1, 890.00, NOW());

-- de qual lote saiu cada unidade vendida (é isso que o rastreio mostra)
INSERT INTO saida_lote (id_item_pedido, id_lote, quantidade, dataCadastro) VALUES (1, 1, 2, NOW());
INSERT INTO saida_lote (id_item_pedido, id_lote, quantidade, dataCadastro) VALUES (2, 5, 6, NOW());
INSERT INTO saida_lote (id_item_pedido, id_lote, quantidade, dataCadastro) VALUES (3, 7, 1, NOW());

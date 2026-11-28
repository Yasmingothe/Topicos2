-- marcas que aparecem nos prototipos
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Taurus', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('CBC', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Glock', 'Áustria', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Bushnell', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Condor', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Remington', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Smith & Wesson', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Beretta', 'Itália', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Ruger', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Boito', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Holosun', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Vortex', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('EOTech', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('3M', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Streamlight', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Pelican', 'Estados Unidos', true, NOW());

-- produtos (ids das marcas: 1 Taurus, 2 CBC, 3 Glock, 4 Bushnell, 5 Condor, 6 Remington, 7 Smith & Wesson,
-- 8 Beretta, 9 Ruger, 10 Boito, 11 Holosun, 12 Vortex, 13 EOTech, 14 3M, 15 Streamlight, 16 Pelican)
-- imagemUrl: as fotos ficam no próprio back, em src/main/resources/META-INF/resources/fotos
-- (o Quarkus serve essa pasta em http://localhost:8080/fotos/...)
-- o calibre fica so no campo calibre, nao no nome
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Pistola Taurus PT 24/7', 1, 'PISTOLA', '9mm', 3890.00, 12, 'Pistola em polímero com ação dupla, carregador de 17 tiros.', true, 'http://localhost:8080/fotos/produto-1.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Revólver Taurus Modelo 82', 1, 'REVOLVER', '.38', 4250.00, 5, 'Revólver de 6 tiros, cano de 4 polegadas.', true, 'http://localhost:8080/fotos/produto-2.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Espingarda Remington 870', 6, 'ESPINGARDA', '12', 3190.00, 7, 'Espingarda de repetição por ação de bombeamento.', true, 'http://localhost:8080/fotos/produto-3.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Rifle Remington 700 SPS Tactical', 6, 'RIFLE_CARABINA', '.308', 6890.00, 4, 'Rifle de ferrolho para tiro de precisão.', true, 'http://localhost:8080/fotos/produto-4.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Pistola Glock 17', 3, 'PISTOLA', '9mm', 5490.00, 3, 'Pistola de uso esportivo em polímero.', true, 'http://localhost:8080/fotos/produto-5.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Mira 3-9x40', 4, 'MIRA_OPTICA', NULL, 890.00, 2, 'Luneta com aumento de 3 a 9 vezes.', true, 'http://localhost:8080/fotos/produto-6.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Coldre Tático Kydex IWB', 5, 'ACESSORIO', NULL, 320.00, 6, 'Coldre de uso interno em Kydex.', true, 'http://localhost:8080/fotos/produto-7.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Munição .38 Special - caixa com 50', 2, 'MUNICAO', '.38', 189.90, 4, 'Caixa com 50 cartuchos.', true, 'http://localhost:8080/fotos/produto-8.jpg', NOW());

-- ampliação do catálogo (produtos 9 a 33)
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Pistola Taurus G2C', 1, 'PISTOLA', '9mm', 3290.00, 8, 'Pistola compacta em polímero, carregador de 12 tiros.', true, 'http://localhost:8080/fotos/produto-9.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Pistola Glock 19', 3, 'PISTOLA', '9mm', 5890.00, 4, 'Versão compacta da Glock 17, carregador de 15 tiros.', true, 'http://localhost:8080/fotos/produto-10.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Pistola Taurus TH380', 1, 'PISTOLA', '.380', 3590.00, 6, 'Pistola de porte médio, carregador de 19 tiros.', true, 'http://localhost:8080/fotos/produto-11.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Revólver Taurus RT 85', 1, 'REVOLVER', '.38', 3490.00, 5, 'Revólver compacto de 5 tiros, cano de 2 polegadas.', true, 'http://localhost:8080/fotos/produto-12.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Revólver Smith & Wesson 686', 7, 'REVOLVER', '.357', 9890.00, 3, 'Revólver em aço inox de 6 tiros, cano de 4 polegadas.', true, 'http://localhost:8080/fotos/produto-13.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Revólver Taurus Raging Hunter', 1, 'REVOLVER', '.44 Magnum', 7490.00, 3, 'Revólver de 6 tiros com cano longo, para caça e tiro esportivo.', true, 'http://localhost:8080/fotos/produto-14.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Carabina CBC 7022', 2, 'RIFLE_CARABINA', '.22 LR', 2190.00, 6, 'Carabina semiautomática leve, indicada para iniciantes.', true, 'http://localhost:8080/fotos/produto-15.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Carabina Taurus T4', 1, 'RIFLE_CARABINA', '5.56', 13900.00, 3, 'Carabina semiautomática de plataforma AR, cano de 16 polegadas.', true, 'http://localhost:8080/fotos/produto-16.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Carabina Ruger 10/22', 9, 'RIFLE_CARABINA', '.22 LR', 3890.00, 4, 'Carabina semiautomática com carregador rotativo de 10 tiros.', true, 'http://localhost:8080/fotos/produto-17.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Espingarda CBC Pump Military 3.0', 2, 'ESPINGARDA', '12', 2890.00, 5, 'Espingarda de repetição com coronha sintética e capacidade de 7 cartuchos.', true, 'http://localhost:8080/fotos/produto-18.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Espingarda Beretta A300 Outlander', 8, 'ESPINGARDA', '12', 8990.00, 3, 'Espingarda semiautomática para caça e tiro ao prato.', true, 'http://localhost:8080/fotos/produto-19.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Espingarda Boito Miura', 10, 'ESPINGARDA', '12', 4290.00, 4, 'Espingarda de canos sobrepostos com coronha em madeira.', true, 'http://localhost:8080/fotos/produto-20.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Munição 9mm Luger - caixa com 50', 2, 'MUNICAO', '9mm', 229.90, 40, 'Caixa com 50 cartuchos de ponta ogival.', true, 'http://localhost:8080/fotos/produto-21.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Munição .380 ACP - caixa com 50', 2, 'MUNICAO', '.380', 199.90, 30, 'Caixa com 50 cartuchos de ponta ogival.', true, 'http://localhost:8080/fotos/produto-22.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Munição .22 WMR - caixa com 50', 2, 'MUNICAO', '.22 WMR', 69.90, 60, 'Caixa com 50 cartuchos para treino.', true, 'http://localhost:8080/fotos/produto-23.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Cartucho calibre 12 - caixa com 25', 2, 'MUNICAO', '12', 159.90, 30, 'Caixa com 25 cartuchos de chumbo.', true, 'http://localhost:8080/fotos/produto-24.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Munição .308 Winchester - caixa com 20', 2, 'MUNICAO', '.308', 349.90, 20, 'Caixa com 20 cartuchos para tiro de precisão.', true, 'http://localhost:8080/fotos/produto-25.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Red dot Holosun HS403B', 11, 'MIRA_OPTICA', NULL, 1890.00, 6, 'Mira de ponto vermelho com bateria de longa duração.', true, 'http://localhost:8080/fotos/produto-26.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Luneta Vortex Crossfire II 4-12x40', 12, 'MIRA_OPTICA', NULL, 1690.00, 5, 'Luneta com aumento de 4 a 12 vezes e retículo duplex.', true, 'http://localhost:8080/fotos/produto-27.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Mira holográfica EOTech 512', 13, 'MIRA_OPTICA', NULL, 4290.00, 3, 'Mira holográfica para tiro rápido com os dois olhos abertos.', true, 'http://localhost:8080/fotos/produto-28.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Carregador Glock 17 tiros', 3, 'ACESSORIO', '9mm', 289.00, 15, 'Carregador original para pistolas Glock 17 e Glock 19.', true, 'http://localhost:8080/fotos/produto-29.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Lanterna tática Streamlight TLR-1', 15, 'ACESSORIO', NULL, 1290.00, 6, 'Lanterna para trilho Picatinny com 1000 lúmens.', true, 'http://localhost:8080/fotos/produto-30.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Protetor auricular 3M Peltor', 14, 'ACESSORIO', NULL, 249.90, 12, 'Abafador com redução de 21 dB para estande de tiro.', true, 'http://localhost:8080/fotos/produto-31.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Óculos de tiro 3M', 14, 'ACESSORIO', NULL, 89.90, 20, 'Óculos de proteção com lente antiembaçante.', true, 'http://localhost:8080/fotos/produto-32.jpg', NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, imagemUrl, dataCadastro) VALUES ('Maleta rígida Pelican', 16, 'ACESSORIO', NULL, 1490.00, 5, 'Maleta à prova d''água com espuma recortável.', true, 'http://localhost:8080/fotos/produto-33.jpg', NOW());

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

-- ===== USUÁRIOS =====
-- a SENHA não fica mais aqui: quem guarda é o Keycloak (realm "armas", arquivo keycloak/armas-realm.json).
-- keycloakId = o id do mesmo usuário lá no Keycloak (fixo no realm, para os dois ficarem ligados)
-- logins: admin@zero1.com / admin123   |   clientes: senha 123456
INSERT INTO usuario (nome, email, keycloakId, perfil, ativo, dataCadastro) VALUES ('Yasmin Gothe', 'admin@zero1.com', '6f1c2a10-0000-4000-8000-000000000001', 'ADMIN', true, NOW());
INSERT INTO usuario (nome, email, keycloakId, perfil, ativo, dataCadastro) VALUES ('Carlos Mendes', 'carlos@email.com', '6f1c2a10-0000-4000-8000-000000000002', 'CLIENTE', true, NOW());
INSERT INTO usuario (nome, email, keycloakId, perfil, ativo, dataCadastro) VALUES ('Maria Souza', 'maria@email.com', '6f1c2a10-0000-4000-8000-000000000003', 'CLIENTE', true, NOW());
INSERT INTO usuario (nome, email, keycloakId, perfil, ativo, dataCadastro) VALUES ('Lucas Pereira', 'lucas@email.com', '6f1c2a10-0000-4000-8000-000000000004', 'CLIENTE', true, NOW());

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
INSERT INTO nota_entrada (numero, serie, id_fornecedor, dataEmissao, dataEntrada, observacao, dataCadastro) VALUES ('105310', '1', 1, '2026-10-13', '2026-10-15', NULL, NOW());
INSERT INTO nota_entrada (numero, serie, id_fornecedor, dataEmissao, dataEntrada, observacao, dataCadastro) VALUES ('89102', '1', 2, '2026-10-14', '2026-10-16', 'Reposição de munição.', NOW());
INSERT INTO nota_entrada (numero, serie, id_fornecedor, dataEmissao, dataEntrada, observacao, dataCadastro) VALUES ('5607', '2', 3, '2026-10-19', '2026-10-20', 'Importados e acessórios.', NOW());

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
-- nota 4
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (4, 9, 8, 2303.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (4, 11, 6, 2513.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (4, 12, 5, 2443.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (4, 14, 3, 5243.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (4, 16, 3, 9730.00, NOW());
-- nota 5
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (5, 15, 6, 1533.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (5, 18, 5, 2023.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (5, 21, 40, 160.93, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (5, 22, 30, 139.93, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (5, 23, 60, 48.93, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (5, 24, 30, 111.93, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (5, 25, 20, 244.93, NOW());
-- nota 6
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 10, 4, 4123.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 13, 3, 6923.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 17, 4, 2723.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 19, 3, 6293.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 20, 4, 3003.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 26, 6, 1323.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 27, 5, 1183.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 28, 3, 3003.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 29, 15, 202.30, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 30, 6, 903.00, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 31, 12, 174.93, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 32, 20, 62.93, NOW());
INSERT INTO item_nota_entrada (id_nota, id_produto, quantidade, custoUnitario, dataCadastro) VALUES (6, 33, 5, 1043.00, NOW());

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
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-G2C-1015', 9, 10, '2026-10-15', 8, 8, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-TH380-1015', 11, 11, '2026-10-15', 6, 6, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-RT85-1015', 12, 12, '2026-10-15', 5, 5, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-RH44-1015', 14, 13, '2026-10-15', 3, 3, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('TAU-T4-1015', 16, 14, '2026-10-15', 3, 3, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-7022-1016', 15, 15, '2026-10-16', 6, 6, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-PM30-1016', 18, 16, '2026-10-16', 5, 5, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-9MM-1016', 21, 17, '2026-10-16', 40, 40, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-380-1016', 22, 18, '2026-10-16', 30, 30, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-22WMR-1016', 23, 19, '2026-10-16', 60, 60, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-C12-1016', 24, 20, '2026-10-16', 30, 30, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('CBC-308-1016', 25, 21, '2026-10-16', 20, 20, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('GLK-G19-1020', 10, 22, '2026-10-20', 4, 4, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('SW-686-1020', 13, 23, '2026-10-20', 3, 3, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('RUG-1022-1020', 17, 24, '2026-10-20', 4, 4, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('BER-A300-1020', 19, 25, '2026-10-20', 3, 3, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('BOI-MIURA-1020', 20, 26, '2026-10-20', 4, 4, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('HOL-403B-1020', 26, 27, '2026-10-20', 6, 6, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('VTX-CF412-1020', 27, 28, '2026-10-20', 5, 5, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('EOT-512-1020', 28, 29, '2026-10-20', 3, 3, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('GLK-MAG17-1020', 29, 30, '2026-10-20', 15, 15, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('STR-TLR1-1020', 30, 31, '2026-10-20', 6, 6, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('3M-PELTOR-1020', 31, 32, '2026-10-20', 12, 12, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('3M-OCULOS-1020', 32, 33, '2026-10-20', 20, 20, NOW());
INSERT INTO lote (codigo, id_produto, id_item_nota, dataEntrada, quantidadeInicial, quantidadeDisponivel, dataCadastro) VALUES ('PEL-MAL-1020', 33, 34, '2026-10-20', 5, 5, NOW());

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

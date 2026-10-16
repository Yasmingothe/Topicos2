-- marcas que aparecem nos prototipos
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Taurus', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('CBC', 'Brasil', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Glock', 'Áustria', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Bushnell', 'Estados Unidos', true, NOW());
INSERT INTO marca (nome, paisOrigem, ativa, dataCadastro) VALUES ('Condor', 'Brasil', true, NOW());

-- produtos (ids das marcas: 1 Taurus, 2 CBC, 3 Glock, 4 Bushnell, 5 Condor)
-- o calibre fica so no campo calibre, nao no nome
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Pistola G2C Compacta', 1, 'PISTOLA', '9mm', 3890.00, 12, 'Pistola compacta com armação em polímero.', true, NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Revólver RT 605', 1, 'REVOLVER', '.357', 4250.00, 5, 'Revólver de 5 tiros em aço inox.', true, NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Espingarda Pump', 2, 'ESPINGARDA', '12', 3190.00, 7, 'Espingarda de repetição por ação de bombeamento.', true, NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Carabina Bolt-Action', 2, 'RIFLE_CARABINA', '.22 LR', 2650.00, 4, 'Carabina de ferrolho para tiro esportivo.', true, NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Pistola G17', 3, 'PISTOLA', '9mm', 5490.00, 3, 'Pistola de uso esportivo em polímero.', true, NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Mira 3-9x40', 4, 'ACESSORIO_OPTICA', NULL, 890.00, 2, 'Luneta com aumento de 3 a 9 vezes.', true, NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Coldre Tático Kydex IWB', 5, 'ACESSORIO_OPTICA', NULL, 320.00, 6, 'Coldre de uso interno em Kydex.', true, NOW());
INSERT INTO produto (nome, id_marca, categoria, calibre, preco, estoque, descricao, publicado, dataCadastro) VALUES ('Munição Special - caixa com 50', 2, 'MUNICAO', '.38', 189.90, 4, 'Caixa com 50 unidades.', true, NOW());

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
INSERT INTO cliente (nome, email, cpf, dataNascimento, telefone, cep, logradouro, numero, complemento, bairro, id_municipio, dataCadastro) VALUES ('Maria Souza', 'maria@email.com', '52998224725', '1995-03-10', '63999990000', '01001000', 'Praça da Sé', '100', NULL, 'Sé', 1, NOW());
INSERT INTO cliente (nome, email, cpf, dataNascimento, telefone, cep, logradouro, numero, complemento, bairro, id_municipio, dataCadastro) VALUES ('João Pereira', 'joao@email.com', '11144477735', '1990-06-15', '63988887777', '01001000', 'Praça da Sé', '250', NULL, 'Sé', 1, NOW());
-- ======================
-- RECRIAÇÃO DO BANCO DE DADOS
-- ======================
DROP DATABASE IF EXISTS dikebra_bd;
CREATE DATABASE dikebra_bd;
USE dikebra_bd;

-- ======================
-- TABELA DE ÁREAS DE TRABALHO
-- ======================
CREATE TABLE tbl_areas_de_trabalho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30)
);

INSERT INTO tbl_areas_de_trabalho (nome) VALUES
('Produção'),
('Logística'),
('Manutenção'),
('Qualidade'),
('Almoxarifado'),
('Recursos Humanos'),
('Engenharia de Processos'),
('Operações');

-- ======================
-- TABELA DE EMPRESAS
-- ======================
CREATE TABLE tbl_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    cnpj CHAR(14) UNIQUE,
    cidade VARCHAR(50),
    estado VARCHAR(2),
    email VARCHAR(50),
    senha VARCHAR(255)
);

INSERT INTO tbl_empresa (nome, cnpj, cidade, estado, email, senha) VALUES
('Limpeza Total LTDA', '12345678000101', 'São Paulo', 'SP', 'empresa1@email.com', '123'),
('Produtos Ypê S.A.', '23456789000102', 'Amparo', 'SP', 'empresa2@email.com', '123'),
('Higienize Brasil', '34567890000103', 'Rio de Janeiro', 'RJ', 'empresa3@email.com', '123'),
('Limpeza Forte ME', '45678901000104', 'Curitiba', 'PR', 'empresa4@email.com', '123'),
('Casa Limpa Serviços', '56789012000105', 'Salvador', 'BA', 'empresa5@email.com', '123');

-- ======================
-- TABELA DE VAGAS
-- ======================
CREATE TABLE tbl_vaga(
    id_vaga INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    id_categoria INT,
    preco FLOAT,
    id_empresa INT,
    is_pcd BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_categoria) REFERENCES tbl_areas_de_trabalho(id),
    FOREIGN KEY (id_empresa) REFERENCES tbl_empresa(id)
);

INSERT INTO tbl_vaga (nome, id_categoria, preco, id_empresa, is_pcd) VALUES
('Gerente', 2, 2.50, 2, FALSE),
('Analista', 4, 15.99, 2, FALSE),
('Coordenador', 2, 1.50, 2, FALSE), 
('Gestor', 4, 20.99, 2, FALSE),
('Assistente', 1, 20.90, 1, TRUE),
('Estagiário', 5, 15.50, 1, TRUE),
('Técnico', 1, 25.50, 3, FALSE),
('Auxiliar', 5, 10.50, 3, FALSE),
('Diretor', 6, 22.71, 4, FALSE),
('CEO', 7, 16.99, 5, FALSE),
('Auxiliar Administrativo', 1, 2500, 1, FALSE);

-- ======================
-- TABELA DE ENDEREÇOS DOS CANDIDATOS
-- ======================
CREATE TABLE tbl_endereco_do_candidato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    logradouro VARCHAR(400),
    cep VARCHAR(8),
    numero INT,
    bairro VARCHAR(100),
    cidade VARCHAR(50)
);

INSERT INTO tbl_endereco_do_candidato (logradouro, cep, numero, bairro, cidade) VALUES
('Rua das Flores', '01234567', 123, 'Jardim Primavera', 'São Paulo'),
('Av. Paulista', '01311000', 1000, 'Bela Vista', 'São Paulo'),
('Rua do Sol', '04567890', 456, 'Centro', 'Rio de Janeiro'),
('Rua das Acácias', '07080200', 78, 'Vila Esperança', 'Guarulhos'),
('Av. Brasil', '30123456', 850, 'Savassi', 'Belo Horizonte'),
('Rua Pernambuco', '12345678', 321, 'Boa Viagem', 'Recife'),
('Travessa do Norte', '04000111', 55, 'Copacabana', 'Rio de Janeiro'),
('Alameda Santos', '01419002', 900, 'Jardins', 'São Paulo'),
('Rua das Laranjeiras', '78901234', 112, 'Centro', 'Curitiba'),
('Av. Sete de Setembro', '40060001', 770, 'Barra', 'Salvador');

-- ======================
-- TABELA DE CANDIDATOS
-- ======================
CREATE TABLE tbl_candidato (
    cpf CHAR(11) PRIMARY KEY,
    nome_completo VARCHAR(100),    
    telefone VARCHAR(12),
    email VARCHAR(50), 
    id_endereco INT,
    id_status INT,  -- referência à áreas de trabalho
    senha VARCHAR(255),
    limite DECIMAL(10,2) DEFAULT 1.0,
    is_pcd BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco_do_candidato(id),
    FOREIGN KEY (id_status) REFERENCES tbl_areas_de_trabalho(id)
);

INSERT INTO tbl_candidato (cpf, nome_completo, telefone, email, id_endereco, id_status, senha) VALUES
('11999990001', 'João Silva', '11999990001','joao@email.com', 1, 1, '123'),
('11988887772', 'Maria Oliveira', '11988887772','maria@email.com', 2, 2, '123'),
('21999887766', 'Carlos Souza', '21999887766','carlos@email.com', 3, 3, '123'),
('31988881234', 'Ana Paula', '31988881234','ana@email.com', 4, 4, '123'),
('41999995555', 'Felipe Santos', '41999995555','felipe@email.com', 5, 5, '123'),
('51911112222', 'Juliana Lima', '51911112222','juliana@email.com', 6, 1, '123'),
('61933334444', 'Roberto Costa', '61933334444','roberto@email.com', 7, 2, '123'),
('71955556666', 'Fernanda Rocha', '71955556666','fernanda@email.com', 8, 1, '123'),
('81977778888', 'Daniel Ribeiro', '81977778888','daniel@email.com', 9, 2, '123'),
('91966667777', 'Larissa Martins', '91966667777','larissa@email.com', 10, 1, '123');

-- ======================
-- TABELA DE CANDIDATURAS
-- ======================
CREATE TABLE tbl_candatura (
    numero INT AUTO_INCREMENT PRIMARY KEY,
    data_elaboracao DATE,
    id_candidato CHAR(11),
    FOREIGN KEY (id_candidato) REFERENCES tbl_candidato(cpf)
);

INSERT INTO tbl_candatura (data_elaboracao, id_candidato) VALUES
('2025-01-05', '11999990001'),
('2025-01-06', '11988887772'),
('2025-01-07', '21999887766'),
('2025-01-08', '31988881234'),
('2025-01-09', '41999995555'),
('2025-01-10', '51911112222');

-- ======================
-- TABELA DE CONTATOS
-- ======================
CREATE TABLE tbl_contato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidatura INT,
    id_vaga INT,
    FOREIGN KEY (id_candidatura) REFERENCES tbl_candatura(numero),
    FOREIGN KEY (id_vaga) REFERENCES tbl_vaga(id_vaga)
);

INSERT INTO tbl_contato (id_candidatura, id_vaga) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(4, 6);

-- ======================
-- TABELA DE NOTIFICAÇÕES
-- ======================
DROP TABLE IF EXISTS tbl_notificacoes;

CREATE TABLE tbl_notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT,
    mensagem TEXT,
    lida BOOLEAN DEFAULT FALSE,
    data_envio DATETIME DEFAULT NOW(),
    FOREIGN KEY (id_empresa) REFERENCES tbl_empresa(id)
);

-- ======================
-- TESTE DAS TABELAS
-- ======================
SELECT * FROM tbl_candidato;
SELECT * FROM tbl_vaga;
SELECT * FROM tbl_notificacoes;

-- ======================
-- FIM DO SCRIPT
-- ======================

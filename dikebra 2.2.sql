
CREATE DATABASE dikebra_bd;
USE dikebra_bd;

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


CREATE TABLE tbl_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    cnpj  CHAR(14) UNIQUE,
    cidade VARCHAR(50),
    estado VARCHAR(2)
);

INSERT INTO tbl_empresa (nome, cnpj, cidade, estado) VALUES
('Limpeza Total LTDA', '12345678000101', 'São Paulo', 'SP'),
('Produtos Ypê S.A.', '23456789000102', 'Amparo', 'SP'),
('Higienize Brasil', '34567890000103', 'Rio de Janeiro', 'RJ'),
('Limpeza Forte ME', '45678901000104', 'Curitiba', 'PR'),
('Casa Limpa Serviços', '56789012000105', 'Salvador', 'BA');

DROP TABLE IF EXISTS tbl_vaga;

CREATE TABLE tbl_vaga(
	id_vaga INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(50),
	id_categoria INT,
	preco FLOAT,
	id_empresa INT,
	FOREIGN KEY (id_categoria) REFERENCES tbl_areas_de_trabalho(id),
	FOREIGN KEY (id_empresa) REFERENCES tbl_empresa(id)
);

INSERT INTO tbl_vaga (nome, id_categoria, preco, id_empresa) VALUES
('Gerente', 2, 2.50, 2),
('Analista', 4, 15.99, 2),
('Coordenador', 2, 1.50, 2), 
('Gestor', 4, 20.99, 2),
('Assistente', 1, 20.90, 1),
('Estagiário', 5, 15.50, 1),
('Técnico', 1, 25.50, 3),
('Auxiliar', 5, 10.50, 3),
('Diretor', 6, 22.71, 4),
('CEO', 7, 16.99, 5);


CREATE TABLE tbl_nivel_da_vaga (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(50)
);

INSERT INTO tbl_nivel_da_vaga (nome) VALUES
('bom'),
('médio'),
('ruim');

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

CREATE TABLE tbl_candidato (
	cpf CHAR(11) PRIMARY KEY,
	nome_completo VARCHAR(100),	
	telefone VARCHAR(12),
	email VARCHAR(50), 
	id_endereco INT,
	id_status INT,
	FOREIGN KEY (id_endereco) REFERENCES tbl_endereco_do_candidato(id),
	FOREIGN KEY (id_status) REFERENCES tbl_nivel_da_vaga(id)
);

INSERT INTO tbl_candidato (cpf, nome_completo, telefone, email, id_endereco, id_status) VALUES
('11999990001', 'João Silva', '11999990001','joao@email.com', 1, 1),
('11988887772', 'Maria Oliveira', '11988887772','maria@email.com', 2, 2),
('21999887766', 'Carlos Souza', '21999887766','carlos@email.com', 3, 3),
('31988881234', 'Ana Paula', '31988881234','ana@email.com', 4, 1),
('41999995555', 'Felipe Santos', '41999995555','felipe@email.com', 5, 2),
('51911112222', 'Juliana Lima', '51911112222','juliana@email.com', 6, 1),
('61933334444', 'Roberto Costa', '61933334444','roberto@email.com', 7, 3),
('71955556666', 'Fernanda Rocha', '71955556666','fernanda@email.com', 8, 1),
('81977778888', 'Daniel Ribeiro', '81977778888','daniel@email.com', 9, 2),
('91966667777', 'Larissa Martins', '91966667777','larissa@email.com', 10, 1);

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
('2025-01-10', '51911112222'),
('2025-01-11', '61933334444'),
('2025-01-12', '71955556666'),
('2025-01-13', '81977778888'),
('2025-01-14', '91966667777'),
('2025-01-15', '11999990001'),
('2025-01-16', '11988887772'),
('2025-01-17', '21999887766'),
('2025-01-18', '31988881234'),
('2025-01-19', '41999995555'),
('2025-01-20', '51911112222'),
('2025-01-21', '61933334444'),
('2025-01-22', '71955556666'),
('2025-01-23', '81977778888'),
('2025-01-24', '91966667777'),
('2025-01-25', '11999990001'),
('2025-01-26', '11988887772'),
('2025-01-27', '21999887766'),
('2025-01-28', '31988881234'),
('2025-01-29', '41999995555'),
('2025-01-30', '51911112222'),
('2025-02-01', '61933334444'),
('2025-02-02', '71955556666'),
('2025-02-03', '81977778888'),
('2025-02-04', '91966667777');

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
(3, 1),
(4, 6),
(4, 7),
(5, 8),
(5, 9),
(6, 10),
(6, 3),
(7, 4),
(7, 2),
(8, 1);

ALTER TABLE tbl_vaga
DROP FOREIGN KEY tbl_vaga_ibfk_2;

ALTER TABLE tbl_vaga
ADD CONSTRAINT fk_vaga_empresa
FOREIGN KEY (id_empresa) REFERENCES tbl_empresa(id)
ON DELETE CASCADE;


ALTER TABLE tbl_contato
DROP FOREIGN KEY tbl_contato_ibfk_2;

ALTER TABLE tbl_contato
ADD CONSTRAINT fk_contato_vaga
FOREIGN KEY (id_vaga) REFERENCES tbl_vaga(id_vaga)
ON DELETE CASCADE;


ALTER TABLE tbl_candidato ADD COLUMN is_pcd BOOLEAN DEFAULT FALSE;

DELETE FROM tbl_empresa WHERE id = 2;

ALTER TABLE tbl_vaga 
ADD COLUMN is_pcd BOOLEAN DEFAULT FALSE;

UPDATE tbl_vaga SET is_pcd = TRUE WHERE nome IN ('Assistente', 'Estagiário');

SELECT * FROM tbl_vaga WHERE is_pcd = FALSE;




CREATE DATABASE IF NOT EXISTS authly;
-- DROP DATABASE IF EXISTS authly;

USE authly;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role ENUM('ouvinte', 'musico') NOT NULL DEFAULT 'musico',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO usuarios (nome, email, senha, role) VALUES
('Admin', 'admin1@example.com', 'eusoulinda', 'musico'),
('User', 'user2@example.com', 'absolutaeusousthefany', 'ouvinte');

DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS musicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    artista VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    duracao TIME,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO musicas (titulo, artista, genero, duracao) VALUES
('Song 1', 'Artist 1', 'Pop', '00:03:30'),
('Song 2', 'Artist 2', 'Rock', '00:04:15'),
('Song 3', 'Artist 3', 'Jazz', '00:05:00'),
('Song 4', 'Artist 4', 'Classical', '00:06:00'),
('Song 5', 'Artist 5', 'Hip-Hop', '00:03:45');
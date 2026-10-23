-- Configuración del modo automático y registro de los ciclos de riego.
-- Si la base ya existía, correr este archivo una sola vez a mano (ver README del backend).

-- Reglas del modo automático que se editan en el panel (una sola fila, id = 1).
-- La forma del JSON es la del tipo Configuracion de panel/src/lib/config.ts.
CREATE TABLE Configuracion (
    id TINYINT PRIMARY KEY DEFAULT 1,
    datos JSON NOT NULL,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
);

-- Cada vez que una electroválvula se abre se crea una fila; al cerrarse se completa "fin".
-- Sirve para la espera entre ciclos, el tiempo máximo por ciclo y el máximo diario.
CREATE TABLE Ciclo_Riego (
    id_ciclo INT PRIMARY KEY AUTO_INCREMENT,
    id_electrovalvula INT NOT NULL,
    inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fin DATETIME NULL,
    automatico BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_electrovalvula) REFERENCES Electrovalvula(id_electrovalvula),
    INDEX (id_electrovalvula, inicio)
);

-- Momento del último cambio de cada ventilador, para el tiempo mínimo entre cambios
ALTER TABLE Ventilacion
    ADD cambiado_en DATETIME NULL;

-- Las válvulas que ya estaban abiertas empiezan su ciclo ahora
INSERT INTO Ciclo_Riego (id_electrovalvula, inicio)
SELECT id_electrovalvula, NOW() FROM Electrovalvula WHERE estado;

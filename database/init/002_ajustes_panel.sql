-- Ajustes para que el panel y la web pública puedan leer el estado del invernadero.
-- Se ejecuta automáticamente al crear la base desde cero. Si la base ya existía,
-- correr este archivo una sola vez a mano (ver README del backend).

-- Decimales en las mediciones y fecha de cada registro
ALTER TABLE Estacion_Meteorologica
    MODIFY temperatura DECIMAL(5,1),
    MODIFY velocidad_viento DECIMAL(5,1),
    MODIFY precipitacion DECIMAL(6,1),
    ADD registrado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE Variables_ambientales
    MODIFY temperatura DECIMAL(5,1),
    MODIFY precipitacion DECIMAL(6,1),
    ADD registrado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Cada fila es un ventilador; estado = encendido
ALTER TABLE Ventilacion
    ADD nombre VARCHAR(40) NOT NULL DEFAULT '';

-- Cada fila es una electroválvula, de una mesa del invernadero o de un cantero de la huerta
ALTER TABLE Electrovalvula
    ADD nombre VARCHAR(40) NOT NULL DEFAULT '',
    ADD ubicacion ENUM('mesa', 'cantero') NOT NULL DEFAULT 'mesa',
    ADD estado BOOLEAN NOT NULL DEFAULT FALSE;

-- Cada fila es un sensor de humedad de suelo con su última medición
ALTER TABLE Humedad_Suelo
    ADD nombre VARCHAR(40) NOT NULL DEFAULT '',
    ADD ubicacion ENUM('mesa', 'cantero') NOT NULL DEFAULT 'mesa';

-- Grupos de equipos que pueden quedar en modo automático
CREATE TABLE Modo_Automatico (
    grupo ENUM('ventilacion', 'riegoInterno', 'riegoExterno') PRIMARY KEY,
    activo BOOLEAN NOT NULL DEFAULT FALSE
);

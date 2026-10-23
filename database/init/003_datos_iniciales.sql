-- Equipos instalados y una primera medición para que las páginas tengan algo que mostrar.
-- Las mediciones reales las va a cargar el firmware.

INSERT INTO Ventilacion (id_ventilador, nombre, estado) VALUES
    (1, 'Ventilador 1', FALSE),
    (2, 'Ventilador 2', FALSE),
    (3, 'Ventilador 3', FALSE),
    (4, 'Ventilador 4', FALSE);

INSERT INTO Electrovalvula (id_electrovalvula, nombre, ubicacion) VALUES
    (1, 'Mesa 1', 'mesa'),
    (2, 'Mesa 2', 'mesa'),
    (3, 'Mesa 3', 'mesa'),
    (4, 'Mesa 4', 'mesa'),
    (5, 'Mesa 5', 'mesa'),
    (6, 'Mesa 6', 'mesa'),
    (7, 'Cantero 1', 'cantero'),
    (8, 'Cantero 2', 'cantero'),
    (9, 'Cantero 3', 'cantero'),
    (10, 'Cantero 4', 'cantero');

INSERT INTO Humedad_Suelo (id_cantero, nombre, ubicacion, registro_humedad, horario_medicion) VALUES
    (1, 'Mesa 1', 'mesa', 62, NOW()),
    (2, 'Mesa 2', 'mesa', 48, NOW()),
    (3, 'Mesa 3', 'mesa', 71, NOW()),
    (4, 'Mesa 4', 'mesa', 29, NOW()),
    (5, 'Mesa 5', 'mesa', 44, NOW()),
    (6, 'Mesa 6', 'mesa', 22, NOW()),
    (7, 'Cantero 1', 'cantero', 52, NOW()),
    (8, 'Cantero 2', 'cantero', 31, NOW()),
    (9, 'Cantero 3', 'cantero', 66, NOW()),
    (10, 'Cantero 4', 'cantero', 40, NOW());

-- Cada electroválvula riega la mesa o el cantero que tiene su mismo número
INSERT INTO Cantero_Electrovalvula (id_electrovalvula, id_cantero)
SELECT id_electrovalvula, id_electrovalvula FROM Electrovalvula;

INSERT INTO Modo_Automatico (grupo, activo) VALUES
    ('ventilacion', FALSE),
    ('riegoInterno', FALSE),
    ('riegoExterno', FALSE);

INSERT INTO Estacion_Meteorologica (temperatura, velocidad_viento, direccion_viento, humedad, precipitacion)
VALUES (18.6, 14, 315, 54, 0);

INSERT INTO Variables_ambientales (temperatura, humedad, precipitacion, id_registro_EM)
VALUES (26.4, 68, 0, LAST_INSERT_ID());

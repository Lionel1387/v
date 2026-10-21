
CREATE TABLE Estacion_Meteorologica (
    id_registro_EM INT PRIMARY KEY AUTO_INCREMENT,
    temperatura INT,
    velocidad_viento INT,
    direccion_viento INT,
    humedad INT,
    precipitacion INT
);

CREATE TABLE Variables_ambientales (
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    temperatura INT,
    humedad INT,
    precipitacion INT,
    id_registro_EM INT,
    FOREIGN KEY (id_registro_EM)
        REFERENCES Estacion_Meteorologica(id_registro_EM)
);

CREATE TABLE Riego (
    id_riego INT PRIMARY KEY AUTO_INCREMENT,
    estado BOOLEAN,
    horario_riego DATETIME,
    id_registro INT,
    FOREIGN KEY (id_registro)
        REFERENCES Variables_ambientales(id_registro)
);

CREATE TABLE Ventilacion (
    id_ventilador INT PRIMARY KEY AUTO_INCREMENT,
    estado BOOLEAN,
    horario_activacion DATETIME,
    id_registro INT,
    FOREIGN KEY (id_registro)
        REFERENCES Variables_ambientales(id_registro)
);

CREATE TABLE Iluminacion (
    id_lampara INT PRIMARY KEY AUTO_INCREMENT,
    estado BOOLEAN,
    horario_activacion DATETIME
);

CREATE TABLE Electrovalvula (
    id_electrovalvula INT PRIMARY KEY AUTO_INCREMENT,
    hora_activacion DATETIME
);

CREATE TABLE Humedad_Suelo (
    id_cantero INT PRIMARY KEY AUTO_INCREMENT,
    registro_humedad INT,
    horario_medicion DATETIME,
    id_registro_EM INT,
    FOREIGN KEY (id_registro_EM)
        REFERENCES Estacion_Meteorologica(id_registro_EM)
);

CREATE TABLE Cantero_Electrovalvula (
    id_electrovalvula INT,
    id_cantero INT,
    PRIMARY KEY (id_electrovalvula, id_cantero),
    FOREIGN KEY (id_electrovalvula)
        REFERENCES Electrovalvula(id_electrovalvula),
    FOREIGN KEY (id_cantero)
        REFERENCES Humedad_Suelo(id_cantero)
);

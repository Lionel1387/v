// Tipos y datos de ejemplo del invernadero.
// Los campos siguen las tablas de database/init/001_schema.sql para que conectar el backend sea directo.

export type Ventilador = { id: number; nombre: string; encendido: boolean };

// ultimaActivacion: Electrovalvula.hora_activacion, en milisegundos (null = nunca se activó)
export type Valvula = { id: number; nombre: string; encendida: boolean; ultimaActivacion: number | null };

// Humedad_Suelo.registro_humedad, en %
export type SensorHumedad = { id: number; nombre: string; humedad: number };

// Variables_ambientales
export type Ambiente = { temperatura: number; humedad: number };

// Estacion_Meteorologica
export type Estacion = {
  temperatura: number;     // °C
  velocidadViento: number; // km/h
  direccionViento: number; // grados, 0 = norte
  humedad: number;         // %
  precipitacion: number;   // mm
};

// Grupos que pueden quedar en modo automático (las reglas están en config.ts)
export type Automatico = { ventilacion: boolean; riegoInterno: boolean; riegoExterno: boolean };

export type Invernadero = {
  automatico: Automatico;
  ventiladores: Ventilador[];
  valvulasInternas: Valvula[];
  humedadMesas: SensorHumedad[];
  ambiente: Ambiente;
  valvulasExternas: Valvula[];
  humedadCanteros: SensorHumedad[];
  estacion: Estacion;
  actualizado: number;
};

export type Vista = 'estacion' | 'internos' | 'externos' | 'config';

export const vistas: { id: Vista; titulo: string; corto: string; icono: string; detalle: string; seccion: string }[] = [
  { id: 'estacion', titulo: 'Estación meteorológica', corto: 'Estación', icono: 'cloud-sun', detalle: 'Condiciones al aire libre', seccion: 'Monitoreo' },
  { id: 'internos', titulo: 'Datos internos', corto: 'Internos', icono: 'greenhouse', detalle: 'Dentro del invernadero', seccion: 'Monitoreo' },
  { id: 'externos', titulo: 'Datos externos', corto: 'Externos', icono: 'sprout', detalle: 'Canteros de la huerta', seccion: 'Monitoreo' },
  { id: 'config', titulo: 'Configuración', corto: 'Ajustes', icono: 'sliders', detalle: 'Reglas del modo automático', seccion: 'Sistema' },
];

// Por debajo de UMBRAL_RIEGO la tierra pide agua; por encima de UMBRAL_SATURADO está encharcada
export const UMBRAL_RIEGO = 35;
export const UMBRAL_SATURADO = 80;

const min = 60_000;

export function datosDeEjemplo(ahora: number): Invernadero {
  const valvula = (id: number, nombre: string, haceMin: number | null): Valvula =>
    ({ id, nombre, encendida: false, ultimaActivacion: haceMin === null ? null : ahora - haceMin * min });

  return {
    automatico: { ventilacion: false, riegoInterno: false, riegoExterno: false },
    ventiladores: [1, 2, 3, 4].map(id => ({ id, nombre: `Ventilador ${id}`, encendido: id <= 2 })),
    valvulasInternas: [
      valvula(1, 'Mesa 1', 35),
      valvula(2, 'Mesa 2', 140),
      valvula(3, 'Mesa 3', 12),
      valvula(4, 'Mesa 4', 60 * 26),
      valvula(5, 'Mesa 5', 300),
      valvula(6, 'Mesa 6', null),
    ],
    humedadMesas: [62, 48, 71, 29, 44, 22].map((humedad, i) => ({ id: i + 1, nombre: `Mesa ${i + 1}`, humedad })),
    ambiente: { temperatura: 26.4, humedad: 68 },
    valvulasExternas: [
      valvula(1, 'Cantero 1', 90),
      valvula(2, 'Cantero 2', 60 * 30),
      valvula(3, 'Cantero 3', 20),
      valvula(4, 'Cantero 4', 60 * 5),
    ],
    humedadCanteros: [52, 31, 66, 40].map((humedad, i) => ({ id: i + 1, nombre: `Cantero ${i + 1}`, humedad })),
    estacion: { temperatura: 18.6, velocidadViento: 14, direccionViento: 315, humedad: 54, precipitacion: 0 },
    actualizado: ahora,
  };
}

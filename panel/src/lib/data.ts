// Tipos del invernadero. Son los que devuelve GET /invernadero del backend
// (backend/src/invernadero/invernadero.types.ts): si cambia uno, cambiar el otro.

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

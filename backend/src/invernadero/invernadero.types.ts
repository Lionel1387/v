// Misma forma que el tipo Invernadero de panel/src/lib/data.ts. Si cambia uno, cambiar el otro.

export type Ventilador = { id: number; nombre: string; encendido: boolean };

// ultimaActivacion en milisegundos (null = nunca se activó)
export type Valvula = { id: number; nombre: string; encendida: boolean; ultimaActivacion: number | null };

export type SensorHumedad = { id: number; nombre: string; humedad: number };

export type Ambiente = { temperatura: number; humedad: number };

export type Estacion = {
  temperatura: number;     // °C
  velocidadViento: number; // km/h
  direccionViento: number; // grados, 0 = norte
  humedad: number;         // %
  precipitacion: number;   // mm
};

export const GRUPOS_AUTOMATICO = ['ventilacion', 'riegoInterno', 'riegoExterno'] as const;
export type GrupoAutomatico = (typeof GRUPOS_AUTOMATICO)[number];
export type Automatico = Record<GrupoAutomatico, boolean>;

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

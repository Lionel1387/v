// Misma forma que el tipo Configuracion de panel/src/lib/config.ts. Si cambia uno, cambiar el otro.

// Franja horaria "HH:MM"-"HH:MM" que se puede activar o desactivar sin borrarla
export type Franja = { id: number; desde: string; hasta: string; activa: boolean };

// Regla que se puede habilitar o deshabilitar de forma independiente
export type Regla<T> = { activa: boolean; valor: T };

export type RiegoInterno = {
  humedadMin: number;              // % — por debajo arranca el riego
  corte: 'humedad' | 'tiempo';     // cómo se detiene
  humedadObjetivo: number;         // % — si corte = humedad
  duracionRiego: number;           // min — si corte = tiempo
  maxPorValvula: number[];         // min — tope de cada electroválvula por ciclo
  esperaEntreCiclos: number;       // min
  horarios: Franja[];              // cuándo se permite regar
  bloqueos: Franja[];              // cuándo se impide, aunque esté permitido
  dias: boolean[];                 // lunes a domingo
  maxDiario: number;               // min por mesa y por día
};

export type ReglasCantero = {
  humedadMin: Regla<number>;
  humedadObjetivo: Regla<number>;
  duracionMax: Regla<number>;
  espera: Regla<number>;
  horario: Regla<{ desde: string; hasta: string }>;
  dias: Regla<boolean[]>;
};

export type RiegoExterno = {
  modo: 'global' | 'individual';
  global: ReglasCantero;
  canteros: ReglasCantero[];
};

export type Ventilacion = {
  tempEncender: number; // °C
  tempApagar: number;   // °C
  horarios: Franja[];
  tiempoMinimo: number; // min entre un cambio de estado y el siguiente
};

export type Configuracion = {
  riegoInterno: RiegoInterno;
  riegoExterno: RiegoExterno;
  ventilacion: Ventilacion;
};

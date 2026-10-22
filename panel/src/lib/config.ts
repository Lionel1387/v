// Reglas del modo automático. Por ahora solo viven en el navegador (ver useConfiguracion);
// cuando exista el backend, este mismo objeto es el que hay que enviarle.
import { UMBRAL_RIEGO } from './data';

export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

const todaLaSemana = [true, true, true, true, true, true, true];

const reglasCantero: ReglasCantero = {
  humedadMin: { activa: true, valor: 35 },
  humedadObjetivo: { activa: true, valor: 65 },
  duracionMax: { activa: true, valor: 20 },
  espera: { activa: true, valor: 120 },
  horario: { activa: true, valor: { desde: '06:00', hasta: '10:00' } },
  dias: { activa: false, valor: todaLaSemana },
};

export const configInicial: Configuracion = {
  riegoInterno: {
    humedadMin: 35,
    corte: 'humedad',
    humedadObjetivo: 65,
    duracionRiego: 10,
    maxPorValvula: [15, 15, 15, 15, 15, 15],
    esperaEntreCiclos: 60,
    horarios: [
      { id: 1, desde: '07:00', hasta: '10:00', activa: true },
      { id: 2, desde: '18:00', hasta: '20:00', activa: true },
    ],
    bloqueos: [{ id: 1, desde: '12:00', hasta: '16:00', activa: true }],
    dias: todaLaSemana,
    maxDiario: 60,
  },
  riegoExterno: {
    modo: 'global',
    global: reglasCantero,
    canteros: [reglasCantero, reglasCantero, reglasCantero, reglasCantero],
  },
  ventilacion: {
    tempEncender: 28,
    tempApagar: 25,
    horarios: [{ id: 1, desde: '08:00', hasta: '20:00', activa: true }],
    tiempoMinimo: 5,
  },
};

// Humedad por debajo de la cual un cantero necesita riego, según las reglas vigentes
export function umbralCantero(cfg: RiegoExterno, i: number): number {
  const regla = (cfg.modo === 'individual' ? cfg.canteros[i] : cfg.global).humedadMin;
  return regla.activa ? regla.valor : UMBRAL_RIEGO;
}

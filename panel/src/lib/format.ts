import { UMBRAL_RIEGO, UMBRAL_SATURADO } from './data';

export function haceCuanto(ts: number | null, ahora: number): string {
  if (ts === null) return 'Nunca';
  const seg = Math.max(0, Math.round((ahora - ts) / 1000));
  if (seg < 60) return 'Hace instantes';
  const min = Math.floor(seg / 60);
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Ayer' : `Hace ${d} días`;
}

const puntos = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
const puntosLargos = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];

export function puntoCardinal(grados: number, largo = false): string {
  const i = Math.round((((grados % 360) + 360) % 360) / 45) % 8;
  return (largo ? puntosLargos : puntos)[i];
}

export type Tono = 'seco' | 'ok' | 'saturado';

export function estadoHumedad(h: number, min = UMBRAL_RIEGO): { tono: Tono; texto: string } {
  if (h < min) return { tono: 'seco', texto: 'Necesita riego' };
  if (h > UMBRAL_SATURADO) return { tono: 'saturado', texto: 'Saturado' };
  return { tono: 'ok', texto: 'Óptima' };
}

export function estadoLluvia(mm: number): string {
  if (mm <= 0) return 'Sin lluvia';
  if (mm < 2.5) return 'Lluvia débil';
  if (mm < 7.6) return 'Lluvia moderada';
  return 'Lluvia fuerte';
}

export const uno = (n: number) => n.toLocaleString('es-AR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

// Decisiones del modo automático, sin acceso a la base: reciben el estado y la hora, y devuelven qué hacer.
import type { Franja, ReglasCantero, RiegoInterno, Ventilacion } from '../configuracion/configuracion.types';

// Humedad mínima que usa el panel cuando la regla del cantero está deshabilitada (UMBRAL_RIEGO)
export const UMBRAL_RIEGO = 35;

const MIN = 60_000;

export type EstadoValvula = {
  id: number;
  encendida: boolean;
  humedad: number | null; // del sensor de su mesa o cantero (null = sin sensor)
  inicioCiclo: Date | null; // si está abierta, desde cuándo
  ultimoFin: Date | null; // cuándo terminó el último riego
  minutosHoy: number; // tiempo regado hoy, contando el ciclo en curso
};

// Acción para una electroválvula: abrir, cerrar o dejarla como está
export type Accion = 'abrir' | 'cerrar' | null;

const minutosDelDia = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// true si la hora está dentro de la franja; admite franjas que cruzan la medianoche (22:00-02:00)
export function enFranja(ahora: Date, desde: string, hasta: string): boolean {
  const t = ahora.getHours() * 60 + ahora.getMinutes();
  const a = minutosDelDia(desde);
  const b = minutosDelDia(hasta);
  return a <= b ? t >= a && t < b : t >= a || t < b;
}

const enAlguna = (ahora: Date, franjas: Franja[]) => franjas.some(f => f.activa && enFranja(ahora, f.desde, f.hasta));
const hayActivas = (franjas: Franja[]) => franjas.some(f => f.activa);

// Lunes = 0 … domingo = 6, como los días del panel
export const diaSemana = (ahora: Date) => (ahora.getDay() + 6) % 7;

const minutosDesde = (fecha: Date | null, ahora: Date) => (fecha ? (ahora.getTime() - fecha.getTime()) / MIN : Infinity);

export function riegoInterno(v: EstadoValvula, i: number, cfg: RiegoInterno, ahora: Date): Accion {
  const diaPermitido = cfg.dias[diaSemana(ahora)] ?? false;
  const bloqueado = enAlguna(ahora, cfg.bloqueos);
  // Sin franjas activas se puede regar a cualquier hora
  const enHorario = !hayActivas(cfg.horarios) || enAlguna(ahora, cfg.horarios);
  const humedad = v.humedad;

  if (v.encendida) {
    const enCiclo = minutosDesde(v.inicioCiclo, ahora);
    if (!diaPermitido || bloqueado) return 'cerrar';
    if (v.minutosHoy >= cfg.maxDiario) return 'cerrar';
    if (enCiclo >= (cfg.maxPorValvula[i] ?? Infinity)) return 'cerrar';
    if (cfg.corte === 'tiempo' && enCiclo >= cfg.duracionRiego) return 'cerrar';
    if (cfg.corte === 'humedad' && humedad !== null && humedad >= cfg.humedadObjetivo) return 'cerrar';
    return null;
  }

  if (!diaPermitido || bloqueado || !enHorario || humedad === null) return null;
  if (humedad >= cfg.humedadMin) return null;
  if (minutosDesde(v.ultimoFin, ahora) < cfg.esperaEntreCiclos) return null;
  if (v.minutosHoy >= cfg.maxDiario) return null;
  return 'abrir';
}

export function riegoExterno(v: EstadoValvula, r: ReglasCantero, ahora: Date): Accion {
  const diaPermitido = !r.dias.activa || (r.dias.valor[diaSemana(ahora)] ?? false);
  const enHorario = !r.horario.activa || enFranja(ahora, r.horario.valor.desde, r.horario.valor.hasta);
  const minimo = r.humedadMin.activa ? r.humedadMin.valor : UMBRAL_RIEGO;
  const humedad = v.humedad;

  if (v.encendida) {
    if (!diaPermitido || !enHorario) return 'cerrar';
    if (r.duracionMax.activa && minutosDesde(v.inicioCiclo, ahora) >= r.duracionMax.valor) return 'cerrar';
    if (humedad !== null) {
      // Sin humedad objetivo, se corta al superar la mínima
      const objetivo = r.humedadObjetivo.activa ? r.humedadObjetivo.valor : minimo;
      if (humedad >= objetivo) return 'cerrar';
    }
    return null;
  }

  if (!diaPermitido || !enHorario || humedad === null || humedad >= minimo) return null;
  if (r.espera.activa && minutosDesde(v.ultimoFin, ahora) < r.espera.valor) return null;
  return 'abrir';
}

// Estado al que hay que pasar todos los ventiladores juntos (null = dejarlos como están).
// Entre tempApagar y tempEncender no se cambia nada, para que no prendan y apaguen todo el tiempo.
export function ventilacion(temperatura: number, estados: boolean[], ultimoCambio: Date | null, cfg: Ventilacion, ahora: Date): boolean | null {
  const enHorario = !hayActivas(cfg.horarios) || enAlguna(ahora, cfg.horarios);
  const deseado = enHorario && temperatura >= cfg.tempEncender ? true : temperatura <= cfg.tempApagar ? false : null;
  if (deseado === null || estados.every(e => e === deseado)) return null;
  if (minutosDesde(ultimoCambio, ahora) < cfg.tiempoMinimo) return null;
  return deseado;
}

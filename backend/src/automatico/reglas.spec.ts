import type { ReglasCantero, RiegoInterno, Ventilacion } from '../configuracion/configuracion.types';
import { enFranja, riegoExterno, riegoInterno, ventilacion, type EstadoValvula } from './reglas';

// Jueves 22/10/2026 a las 08:30, hora local
const ahora = new Date(2026, 9, 22, 8, 30);
const haceMin = (m: number) => new Date(ahora.getTime() - m * 60_000);
const semana = [true, true, true, true, true, true, true];

const interno: RiegoInterno = {
  humedadMin: 35,
  corte: 'humedad',
  humedadObjetivo: 65,
  duracionRiego: 10,
  maxPorValvula: [15, 15, 15, 15, 15, 15],
  esperaEntreCiclos: 60,
  horarios: [{ id: 1, desde: '07:00', hasta: '10:00', activa: true }],
  bloqueos: [{ id: 1, desde: '12:00', hasta: '16:00', activa: true }],
  dias: semana,
  maxDiario: 60,
};

const valvula = (p: Partial<EstadoValvula> = {}): EstadoValvula => ({
  id: 1, encendida: false, humedad: 20, inicioCiclo: null, ultimoFin: null, minutosHoy: 0, ...p,
});

describe('enFranja', () => {
  it('incluye el inicio y excluye el final', () => {
    expect(enFranja(new Date(2026, 9, 22, 7, 0), '07:00', '10:00')).toBe(true);
    expect(enFranja(new Date(2026, 9, 22, 10, 0), '07:00', '10:00')).toBe(false);
  });
  it('admite franjas que cruzan la medianoche', () => {
    expect(enFranja(new Date(2026, 9, 22, 23, 0), '22:00', '02:00')).toBe(true);
    expect(enFranja(new Date(2026, 9, 22, 1, 0), '22:00', '02:00')).toBe(true);
    expect(enFranja(new Date(2026, 9, 22, 3, 0), '22:00', '02:00')).toBe(false);
  });
});

describe('riegoInterno', () => {
  it('abre si la tierra está seca dentro del horario', () => {
    expect(riegoInterno(valvula(), 0, interno, ahora)).toBe('abrir');
  });
  it('no abre fuera del horario, en un bloqueo, un día no elegido o sin esperar entre ciclos', () => {
    expect(riegoInterno(valvula(), 0, interno, new Date(2026, 9, 22, 11, 0))).toBeNull();
    expect(riegoInterno(valvula(), 0, { ...interno, horarios: [] }, new Date(2026, 9, 22, 13, 0))).toBeNull();
    expect(riegoInterno(valvula(), 0, { ...interno, dias: semana.map((_, i) => i !== 3) }, ahora)).toBeNull();
    expect(riegoInterno(valvula({ ultimoFin: haceMin(30) }), 0, interno, ahora)).toBeNull();
    expect(riegoInterno(valvula({ minutosHoy: 60 }), 0, interno, ahora)).toBeNull();
  });
  it('no abre si la humedad ya alcanza la mínima', () => {
    expect(riegoInterno(valvula({ humedad: 40 }), 0, interno, ahora)).toBeNull();
  });
  it('cierra al llegar a la humedad objetivo o al tiempo máximo de la electroválvula', () => {
    const abierta = { encendida: true, inicioCiclo: haceMin(5) };
    expect(riegoInterno(valvula({ ...abierta, humedad: 50 }), 0, interno, ahora)).toBeNull();
    expect(riegoInterno(valvula({ ...abierta, humedad: 65 }), 0, interno, ahora)).toBe('cerrar');
    expect(riegoInterno(valvula({ ...abierta, humedad: 50, inicioCiclo: haceMin(15) }), 0, interno, ahora)).toBe('cerrar');
  });
  it('con corte por tiempo cierra al cumplir la duración', () => {
    const cfg = { ...interno, corte: 'tiempo' as const };
    expect(riegoInterno(valvula({ encendida: true, inicioCiclo: haceMin(9), humedad: 90 }), 0, cfg, ahora)).toBeNull();
    expect(riegoInterno(valvula({ encendida: true, inicioCiclo: haceMin(10) }), 0, cfg, ahora)).toBe('cerrar');
  });
});

describe('riegoExterno', () => {
  const reglas: ReglasCantero = {
    humedadMin: { activa: true, valor: 35 },
    humedadObjetivo: { activa: true, valor: 65 },
    duracionMax: { activa: true, valor: 20 },
    espera: { activa: true, valor: 120 },
    horario: { activa: true, valor: { desde: '06:00', hasta: '10:00' } },
    dias: { activa: false, valor: semana },
  };

  it('abre con tierra seca y cierra al llegar al objetivo o a la duración máxima', () => {
    expect(riegoExterno(valvula(), reglas, ahora)).toBe('abrir');
    expect(riegoExterno(valvula({ encendida: true, inicioCiclo: haceMin(5), humedad: 70 }), reglas, ahora)).toBe('cerrar');
    expect(riegoExterno(valvula({ encendida: true, inicioCiclo: haceMin(20), humedad: 40 }), reglas, ahora)).toBe('cerrar');
  });
  it('una regla deshabilitada no se aplica', () => {
    const sinHorario = { ...reglas, horario: { ...reglas.horario, activa: false } };
    expect(riegoExterno(valvula(), reglas, new Date(2026, 9, 22, 18, 0))).toBeNull();
    expect(riegoExterno(valvula(), sinHorario, new Date(2026, 9, 22, 18, 0))).toBe('abrir');
  });
});

describe('ventilacion', () => {
  const cfg: Ventilacion = {
    tempEncender: 28, tempApagar: 25, tiempoMinimo: 5,
    horarios: [{ id: 1, desde: '08:00', hasta: '20:00', activa: true }],
  };

  it('enciende con calor y apaga con fresco, sin cambiar entre medio', () => {
    expect(ventilacion(29, [false, false], null, cfg, ahora)).toBe(true);
    expect(ventilacion(24, [true, false], null, cfg, ahora)).toBe(false);
    expect(ventilacion(26, [true, true], null, cfg, ahora)).toBeNull();
  });
  it('respeta el tiempo mínimo entre cambios y el horario', () => {
    expect(ventilacion(29, [false], haceMin(2), cfg, ahora)).toBeNull();
    expect(ventilacion(29, [false], null, cfg, new Date(2026, 9, 22, 22, 0))).toBeNull();
  });
});

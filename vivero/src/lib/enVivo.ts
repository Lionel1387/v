import { enVivoEjemplo, type EnVivo } from './data';

// Estado del invernadero del backend adaptado a la sección "En vivo".
// obtenerEnVivo() corre en el servidor de Next y da los datos de la primera carga;
// después Live.tsx se suscribe a /invernadero/eventos desde el navegador y recibe cada cambio al instante.
const API = process.env.API_URL ?? 'http://localhost:4000';
// Cada cuántos segundos el servidor de Next vuelve a pedir el estado para la primera carga
const REVALIDAR = 5;

type Valvula = { encendida: boolean };
type Sensor = { humedad: number };
export type Invernadero = {
  ventiladores: { encendido: boolean }[];
  valvulasInternas: Valvula[];
  humedadMesas: Sensor[];
  ambiente: { temperatura: number; humedad: number };
  valvulasExternas: Valvula[];
  humedadCanteros: Sensor[];
  estacion: { temperatura: number; velocidadViento: number; direccionViento: number; humedad: number; precipitacion: number };
};

const puntos = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
const puntoCardinal = (grados: number) => puntos[Math.round((((grados % 360) + 360) % 360) / 45) % 8];

export function adaptar(d: Invernadero): EnVivo {
  return {
    demo: false,
    interior: {
      temperatura: d.ambiente.temperatura,
      humedad: d.ambiente.humedad,
      ventiladores: d.ventiladores.map(v => v.encendido),
      riego: d.valvulasInternas.map(v => v.encendida),
      suelo: d.humedadMesas.map(s => s.humedad),
    },
    exterior: {
      temperatura: d.estacion.temperatura,
      humedad: d.estacion.humedad,
      viento: d.estacion.velocidadViento,
      direccionViento: puntoCardinal(d.estacion.direccionViento),
      precipitacion: d.estacion.precipitacion,
      riego: d.valvulasExternas.map(v => v.encendida),
      suelo: d.humedadCanteros.map(s => s.humedad),
    },
  };
}

export async function obtenerEnVivo(): Promise<EnVivo> {
  try {
    const res = await fetch(`${API}/invernadero`, { next: { revalidate: REVALIDAR } });
    if (!res.ok) throw new Error(`El backend respondió ${res.status}`);
    return adaptar(await res.json());
  } catch (e) {
    // Sin backend la página igual se muestra, con los datos de ejemplo y el aviso correspondiente
    console.warn('[en vivo] usando datos de ejemplo:', e instanceof Error ? e.message : e);
    return enVivoEjemplo;
  }
}

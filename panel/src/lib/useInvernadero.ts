'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Automatico, Invernadero } from './data';

// Estado del invernadero leído del backend (que a su vez lee la base de datos).
// Llega por Server-Sent Events (/invernadero/eventos): cada cambio, hecho desde este panel o desde otro,
// aparece al instante. Las acciones se muestran enseguida y después se confirman con el backend.

// Mismo host con el que se abrió el panel (localhost o la IP de la PC desde el celular), puerto del backend.
// Se puede fijar con NEXT_PUBLIC_API_URL.
export const API = process.env.NEXT_PUBLIC_API_URL
  ?? (typeof location === 'undefined' ? 'http://localhost:4000' : `${location.protocol}//${location.hostname}:4000`);

export type GrupoValvulas = 'valvulasInternas' | 'valvulasExternas';

async function enviar(ruta: string, cuerpo: object) {
  const res = await fetch(`${API}/invernadero/${ruta}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  if (!res.ok) throw new Error(`El backend respondió ${res.status}`);
}

export function useInvernadero() {
  const [datos, setDatos] = useState<Invernadero | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch(`${API}/invernadero`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`El backend respondió ${res.status}`);
      setDatos(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sin conexión con el backend');
    }
  }, []);

  useEffect(() => {
    // EventSource se reconecta solo si el backend se corta
    const fuente = new EventSource(`${API}/invernadero/eventos`);
    fuente.onmessage = e => {
      try {
        setDatos(JSON.parse(e.data));
        setError(null);
      } catch {}
    };
    fuente.onerror = () => setError('Sin conexión con el backend');
    return () => fuente.close();
  }, []);

  // Aplica el cambio en pantalla y lo manda al backend; si falla, vuelve al estado real y avisa
  const accion = useCallback((cambio: (d: Invernadero) => Invernadero, ruta: string, cuerpo: object) => {
    setDatos(d => d && cambio(d));
    enviar(ruta, cuerpo).catch(async e => {
      await cargar();
      setError(e instanceof Error ? e.message : 'No se pudo guardar el cambio');
    });
  }, [cargar]);

  const setVentilador = useCallback((id: number | 'todos', encendido: boolean) => {
    accion(d => ({
      ...d,
      ventiladores: d.ventiladores.map(v => (id === 'todos' || v.id === id ? { ...v, encendido } : v)),
    }), `ventiladores/${id}`, { encendido });
  }, [accion]);

  const setValvula = useCallback((grupo: GrupoValvulas, id: number | 'todas', encendida: boolean) => {
    const ahora = Date.now();
    accion(d => ({
      ...d,
      [grupo]: d[grupo].map(v =>
        id === 'todas' || v.id === id
          ? { ...v, encendida, ultimaActivacion: encendida && !v.encendida ? ahora : v.ultimaActivacion }
          : v,
      ),
    }), `${grupo}/${id}`, { encendida });
  }, [accion]);

  const setAutomatico = useCallback((grupo: keyof Automatico, activo: boolean) => {
    accion(d => ({ ...d, automatico: { ...d.automatico, [grupo]: activo } }), `automatico/${grupo}`, { activo });
  }, [accion]);

  return { datos, error, setVentilador, setValvula, setAutomatico };
}

// Hora actual que se refresca sola, para los textos "hace X min"
export function useAhora(cada = 15_000) {
  const [ahora, setAhora] = useState(0);
  useEffect(() => {
    setAhora(Date.now());
    const t = setInterval(() => setAhora(Date.now()), cada);
    return () => clearInterval(t);
  }, [cada]);
  return ahora;
}

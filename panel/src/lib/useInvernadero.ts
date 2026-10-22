'use client';

import { useCallback, useEffect, useState } from 'react';
import { datosDeEjemplo, type Automatico, type Invernadero } from './data';

// Estado del invernadero y acciones sobre los equipos.
// Por ahora solo frontend: los datos son fijos (datosDeEjemplo) y las acciones cambian el estado
// local. Para conectar el backend, reemplazar la carga inicial y las acciones por fetch().

export type GrupoValvulas = 'valvulasInternas' | 'valvulasExternas';

export function useInvernadero() {
  const [datos, setDatos] = useState<Invernadero | null>(null);

  useEffect(() => {
    // Se carga en el cliente para que las horas relativas no difieran entre servidor y navegador
    setDatos(datosDeEjemplo(Date.now()));
  }, []);

  const setVentilador = useCallback((id: number | 'todos', encendido: boolean) => {
    setDatos(d => d && {
      ...d,
      ventiladores: d.ventiladores.map(v => (id === 'todos' || v.id === id ? { ...v, encendido } : v)),
    });
  }, []);

  const setValvula = useCallback((grupo: GrupoValvulas, id: number | 'todas', encendida: boolean) => {
    const ahora = Date.now();
    setDatos(d => d && {
      ...d,
      [grupo]: d[grupo].map(v =>
        id === 'todas' || v.id === id
          ? { ...v, encendida, ultimaActivacion: encendida && !v.encendida ? ahora : v.ultimaActivacion }
          : v,
      ),
    });
  }, []);

  const setAutomatico = useCallback((grupo: keyof Automatico, activo: boolean) => {
    setDatos(d => d && { ...d, automatico: { ...d.automatico, [grupo]: activo } });
  }, []);

  return { datos, setVentilador, setValvula, setAutomatico };
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

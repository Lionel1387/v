'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { configInicial, type Configuracion } from './config';
import { API } from './useInvernadero';

// La configuración se guarda en el backend (tabla Configuracion), que la usa para el modo automático.
// Cada cambio se envía solo, un instante después de la última modificación.
const ESPERA_GUARDADO = 600;

export type EstadoConfig = 'cargando' | 'guardando' | 'guardada' | 'error';

// Completa con los valores iniciales lo que falte (por ejemplo, campos nuevos)
const completar = (c: Partial<Configuracion>): Configuracion => ({
  riegoInterno: { ...configInicial.riegoInterno, ...c.riegoInterno },
  riegoExterno: { ...configInicial.riegoExterno, ...c.riegoExterno },
  ventilacion: { ...configInicial.ventilacion, ...c.ventilacion },
});

export function useConfiguracion() {
  const [config, setConfig] = useState<Configuracion>(configInicial);
  const [estado, setEstado] = useState<EstadoConfig>('cargando');
  // No se guarda nada hasta haber leído la configuración del backend, para no pisarla con los valores iniciales
  const leida = useRef(false);
  // Evita volver a guardar lo que se acaba de leer
  const recienCargada = useRef(false);

  useEffect(() => {
    fetch(`${API}/configuracion`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ configuracion: Configuracion | null }>;
      })
      .then(({ configuracion }) => {
        leida.current = true;
        if (configuracion) {
          recienCargada.current = true;
          setConfig(completar(configuracion));
          setEstado('guardada');
        } else {
          // Nunca se guardó: se guardan los valores iniciales para que el modo automático tenga reglas
          recienCargada.current = false;
          setConfig({ ...configInicial });
        }
      })
      .catch(() => setEstado('error'));
  }, []);

  useEffect(() => {
    if (!leida.current) return;
    if (recienCargada.current) {
      recienCargada.current = false;
      return;
    }
    setEstado('guardando');
    const t = setTimeout(() => {
      fetch(`${API}/configuracion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
        .then(res => setEstado(res.ok ? 'guardada' : 'error'))
        .catch(() => setEstado('error'));
    }, ESPERA_GUARDADO);
    return () => clearTimeout(t);
  }, [config]);

  const restablecer = useCallback(() => setConfig({ ...configInicial }), []);

  return { config, setConfig, restablecer, estado };
}

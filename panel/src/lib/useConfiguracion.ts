'use client';

import { useCallback, useEffect, useState } from 'react';
import { configInicial, type Configuracion } from './config';

// La configuración se guarda en el navegador (localStorage) hasta que exista el backend.
const CLAVE = 'biolab-panel-config-v1';

export function useConfiguracion() {
  const [config, setConfig] = useState<Configuracion>(configInicial);
  const [cargada, setCargada] = useState(false);

  useEffect(() => {
    try {
      const guardada = localStorage.getItem(CLAVE);
      if (guardada) setConfig({ ...configInicial, ...JSON.parse(guardada) });
    } catch {
      // Sin acceso a localStorage (modo privado, bloqueado): se usan los valores iniciales
    }
    setCargada(true);
  }, []);

  useEffect(() => {
    if (!cargada) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(config));
    } catch {}
  }, [config, cargada]);

  const restablecer = useCallback(() => setConfig(configInicial), []);

  return { config, setConfig, restablecer };
}

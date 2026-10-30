'use client';

import { Fragment, useEffect, useState } from 'react';
import { vistas, type Vista } from '@/lib/data';
import { useConfiguracion } from '@/lib/useConfiguracion';
import { useAhora, useInvernadero } from '@/lib/useInvernadero';
import { Icon } from './Icon';
import Configuracion from './vistas/Configuracion';
import Estacion from './vistas/Estacion';
import Externos from './vistas/Externos';
import Internos from './vistas/Internos';

const textoConfig = {
  cargando: 'Cargando configuración…',
  guardando: 'Guardando…',
  guardada: 'Guardada en el servidor',
  error: 'Sin conexión: los cambios no se guardan',
} as const;

const esVista = (s: string): s is Vista => vistas.some(v => v.id === s);
const secciones = [...new Set(vistas.map(v => v.seccion))];

export default function Panel() {
  const [vista, setVista] = useState<Vista>('estacion');
  const { datos, error, setVentilador, setValvula, setAutomatico } = useInvernadero();
  const { config, setConfig, restablecer, estado: estadoConfig } = useConfiguracion();
  const ahora = useAhora();

  // La vista elegida queda en la URL (#internos) para poder compartirla o recargar
  useEffect(() => {
    const leer = () => {
      const h = location.hash.slice(1);
      if (esVista(h)) setVista(h);
    };
    leer();
    addEventListener('hashchange', leer);
    return () => removeEventListener('hashchange', leer);
  }, []);

  const ir = (v: Vista) => {
    setVista(v);
    history.replaceState(null, '', `#${v}`);
    scrollTo({ top: 0 });
  };

  const actual = vistas.find(v => v.id === vista)!;
  const enLinea = datos !== null && error === null;

  const boton = (v: (typeof vistas)[number]) => (
    <button
      key={v.id}
      type="button"
      className={v.id === vista ? 'active' : undefined}
      aria-current={v.id === vista ? 'page' : undefined}
      onClick={() => ir(v.id)}
    >
      <Icon name={v.icono} />
      <span className="largo">{v.titulo}</span>
      <span className="corto">{v.corto}</span>
    </button>
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-ico"><Icon name="leaf" /></span>
          <div>
            <strong>BioLab Nativo</strong>
            <span>Panel del invernadero</span>
          </div>
        </div>
        {secciones.map(s => (
          <Fragment key={s}>
            <p className="sidebar-label">{s}</p>
            <nav className="side-nav" aria-label={s}>{vistas.filter(v => v.seccion === s).map(boton)}</nav>
          </Fragment>
        ))}
        <div className="sidebar-pie">
          <span className={`estado-dot${enLinea ? ' ok' : ''}`} />
          <div>
            <strong>{enLinea ? 'Conectado' : 'Sin conexión'}</strong>
            <span>{enLinea ? 'Datos de la base de datos' : error ?? 'Conectando con el backend…'}</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="toolbar">
          <div>
            <p className="toolbar-sub">{actual.detalle}</p>
            <h1>{actual.titulo}</h1>
          </div>
          <p className="toolbar-act">
            <span className={`estado-dot${(vista === 'config' ? estadoConfig !== 'error' : enLinea) ? ' ok' : ''}`} />
            {vista === 'config' ? textoConfig[estadoConfig] : error ? 'Sin conexión con el backend' : datos ? 'En vivo' : 'Cargando…'}
          </p>
        </header>

        <div className="contenido" key={vista}>
          {vista === 'config' ? (
            <Configuracion config={config} setConfig={setConfig} restablecer={restablecer} />
          ) : !datos ? (
            <div className="cargando" aria-live="polite">
              {error ? `No se pudieron cargar los datos: ${error}` : 'Cargando datos…'}
            </div>
          ) : vista === 'estacion' ? (
            <Estacion datos={datos.estacion} />
          ) : vista === 'internos' ? (
            <Internos
              datos={datos}
              ahora={ahora}
              humedadMin={config.riegoInterno.humedadMin}
              setVentilador={setVentilador}
              setValvula={setValvula}
              setAutomatico={setAutomatico}
            />
          ) : (
            <Externos datos={datos} ahora={ahora} riego={config.riegoExterno} setValvula={setValvula} setAutomatico={setAutomatico} />
          )}
        </div>
      </main>

      <nav className="tabbar" aria-label="Secciones">{vistas.map(boton)}</nav>
    </div>
  );
}

// Piezas comunes a las vistas de monitoreo: grupos, interruptores y tarjetas.
import { estadoHumedad } from '@/lib/format';
import { Icon } from './Icon';

export function Grupo({ titulo, detalle, icono, accion, children }: {
  titulo: string;
  detalle?: string;
  icono: string;
  accion?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grupo">
      <header className="grupo-head">
        <span className="grupo-ico"><Icon name={icono} /></span>
        <div className="grupo-txt">
          <h2>{titulo}</h2>
          {detalle && <p>{detalle}</p>}
        </div>
        {accion && <div className="acciones">{accion}</div>}
      </header>
      {children}
    </section>
  );
}

export function Switch({ checked, onChange, label, disabled }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" disabled={disabled} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

// Botón para encender o apagar todo el grupo de una vez
export function BotonGeneral({ todos, onChange, encender, apagar, disabled }: {
  todos: boolean;
  onChange: (v: boolean) => void;
  encender: string;
  apagar: string;
  disabled?: boolean;
}) {
  return (
    <button type="button" className={`pill${todos ? ' pill-on' : ''}`} disabled={disabled} onClick={() => onChange(!todos)}>
      <Icon name="power" />
      <span>{todos ? apagar : encender}</span>
    </button>
  );
}

// Activa el modo automático del grupo: los equipos pasan a seguir las reglas de Configuración
export function BotonAuto({ activo, onChange }: { activo: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={`pill pill-auto${activo ? ' on' : ''}`} aria-pressed={activo} onClick={() => onChange(!activo)}>
      <Icon name="auto" />
      <span>Automático</span>
    </button>
  );
}

export function TarjetaEquipo({ icono, nombre, encendido, estado, detalle, onChange, animacion, automatico }: {
  icono: string;
  nombre: string;
  encendido: boolean;
  estado: string;
  detalle?: React.ReactNode;
  onChange: (v: boolean) => void;
  animacion: 'girar' | 'gotear';
  automatico?: boolean;
}) {
  return (
    <article className={`card equipo${encendido ? ' on' : ''}`}>
      <div className="equipo-top">
        <span className={`equipo-ico ${animacion}`}><Icon name={icono} /></span>
        <Switch
          checked={encendido}
          onChange={onChange}
          disabled={automatico}
          label={automatico ? `${nombre} en modo automático` : `${encendido ? 'Apagar' : 'Encender'} ${nombre}`}
        />
      </div>
      <h3>{nombre}</h3>
      <p className="equipo-estado"><span className="dot" />{estado}{automatico && <span className="tag-auto">Auto</span>}</p>
      {detalle && <p className="equipo-detalle">{detalle}</p>}
    </article>
  );
}

export function TarjetaHumedad({ nombre, humedad, min }: { nombre: string; humedad: number; min?: number }) {
  const { tono, texto } = estadoHumedad(humedad, min);
  const r = 27;
  const c = 2 * Math.PI * r;
  const valor = Math.round(humedad);
  return (
    <article className={`card humedad ${tono}`}>
      <div className="anillo" role="img" aria-label={`Humedad ${valor}%`}>
        <svg viewBox="0 0 64 64">
          <circle className="anillo-bg" cx="32" cy="32" r={r} />
          <circle className="anillo-fg" cx="32" cy="32" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - valor / 100)} />
        </svg>
        <span>{valor}<small>%</small></span>
      </div>
      <div>
        <h3>{nombre}</h3>
        <p className="badge">{tono === 'seco' && <Icon name="drop" />}{texto}</p>
      </div>
    </article>
  );
}

// Controles de la vista Configuración, al estilo de la app Ajustes de iOS.
import { DIAS, type Franja } from '@/lib/config';
import { Icon } from './Icon';
import { Switch } from './ui';

export function Lista({ titulo, pie, children }: { titulo?: string; pie?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="lista-bloque">
      {titulo && <h3 className="lista-titulo">{titulo}</h3>}
      <div className="lista">{children}</div>
      {pie && <p className="lista-pie">{pie}</p>}
    </div>
  );
}

export function Fila({ etiqueta, detalle, ancha, children }: {
  etiqueta: string;
  detalle?: string;
  ancha?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`fila${ancha ? ' ancha' : ''}`}>
      <div className="fila-txt"><span>{etiqueta}</span>{detalle && <small>{detalle}</small>}</div>
      <div className="fila-ctrl">{children}</div>
    </div>
  );
}

// Fila con interruptor propio: si la regla está deshabilitada, su control queda bloqueado
export function FilaRegla({ etiqueta, detalle, activa, onActiva, ancha, children }: {
  etiqueta: string;
  detalle?: string;
  activa: boolean;
  onActiva: (v: boolean) => void;
  ancha?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`fila${ancha ? ' ancha' : ''}${activa ? '' : ' apagada'}`}>
      <div className="fila-txt"><span>{etiqueta}</span>{detalle && <small>{detalle}</small>}</div>
      <fieldset className="fila-ctrl" disabled={!activa}>{children}</fieldset>
      <Switch checked={activa} onChange={onActiva} label={`${activa ? 'Deshabilitar' : 'Habilitar'} regla: ${etiqueta}`} />
    </div>
  );
}

export function Stepper({ valor, onChange, min, max, paso = 1, unidad, label }: {
  valor: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  paso?: number;
  unidad: string;
  label: string;
}) {
  const fijar = (v: number) => onChange(Math.round(Math.min(max, Math.max(min, v)) * 10) / 10);
  return (
    <div className="stepper">
      <button type="button" aria-label={`Bajar ${label}`} disabled={valor <= min} onClick={() => fijar(valor - paso)}>
        <Icon name="minus" />
      </button>
      <label className="stepper-valor">
        <input
          type="number"
          inputMode="decimal"
          value={valor}
          min={min}
          max={max}
          step={paso}
          aria-label={label}
          onChange={e => { if (e.target.value !== '') onChange(Number(e.target.value)); }}
          onBlur={() => fijar(valor)}
        />
        <span>{unidad}</span>
      </label>
      <button type="button" aria-label={`Subir ${label}`} disabled={valor >= max} onClick={() => fijar(valor + paso)}>
        <Icon name="plus" />
      </button>
    </div>
  );
}

export function Segmentado<T extends string>({ opciones, valor, onChange, label }: {
  opciones: { valor: T; texto: string }[];
  valor: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="segmentado" role="radiogroup" aria-label={label}>
      {opciones.map(o => (
        <button key={o.valor} type="button" role="radio" aria-checked={o.valor === valor} onClick={() => onChange(o.valor)}>
          {o.texto}
        </button>
      ))}
    </div>
  );
}

export function Dias({ valor, onChange }: { valor: boolean[]; onChange: (v: boolean[]) => void }) {
  return (
    <div className="dias">
      {DIAS.map((dia, i) => (
        <button
          key={dia}
          type="button"
          title={dia}
          aria-label={dia}
          aria-pressed={valor[i]}
          onClick={() => onChange(valor.map((v, j) => (j === i ? !v : v)))}
        >
          {dia[0]}
        </button>
      ))}
    </div>
  );
}

export function Rango({ desde, hasta, onChange }: {
  desde: string;
  hasta: string;
  onChange: (r: { desde: string; hasta: string }) => void;
}) {
  return (
    <div className="rango">
      <input type="time" value={desde} aria-label="Desde" onChange={e => onChange({ desde: e.target.value, hasta })} />
      <span>a</span>
      <input type="time" value={hasta} aria-label="Hasta" onChange={e => onChange({ desde, hasta: e.target.value })} />
    </div>
  );
}

// Lista editable de franjas horarias: cada una se puede activar, desactivar o borrar
export function Franjas({ franjas, onChange, vacio, agregar }: {
  franjas: Franja[];
  onChange: (f: Franja[]) => void;
  vacio: string;
  agregar: string;
}) {
  const editar = (id: number, cambios: Partial<Franja>) =>
    onChange(franjas.map(f => (f.id === id ? { ...f, ...cambios } : f)));
  const nuevoId = Math.max(0, ...franjas.map(f => f.id)) + 1;

  return (
    <>
      {franjas.length === 0 && <div className="fila"><span className="fila-vacia">{vacio}</span></div>}
      {franjas.map(f => (
        <div key={f.id} className={`fila${f.activa ? '' : ' apagada'}`}>
          <div className="fila-txt">
            <Rango desde={f.desde} hasta={f.hasta} onChange={r => editar(f.id, r)} />
          </div>
          <div className="fila-ctrl">
            <Switch checked={f.activa} onChange={activa => editar(f.id, { activa })} label={`${f.activa ? 'Desactivar' : 'Activar'} franja de ${f.desde} a ${f.hasta}`} />
            <button type="button" className="borrar" aria-label={`Eliminar franja de ${f.desde} a ${f.hasta}`} onClick={() => onChange(franjas.filter(x => x.id !== f.id))}>
              <Icon name="trash" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="fila fila-agregar"
        onClick={() => onChange([...franjas, { id: nuevoId, desde: '08:00', hasta: '10:00', activa: true }])}
      >
        <Icon name="plus" />{agregar}
      </button>
    </>
  );
}

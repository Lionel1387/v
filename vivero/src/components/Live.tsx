import { enVivo, humedadMinima } from '@/lib/data';
import { Icon } from './Icon';
import Plano from './Plano';

// Estado actual del vivero, solo para mirar: interior y exterior separados por una línea.
const uno = (n: number) => n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function Dato({ icon, label, value, unit }: { icon: string; label: string; value: string; unit: string }) {
  return (
    <div className="live-stat">
      <span className="live-label"><Icon name={icon} />{label}</span>
      <strong>{value}<small>{unit}</small></strong>
    </div>
  );
}

function Actividad({ icon, titulo, detalle, activa, estado, tipo }: {
  icon: string;
  titulo: string;
  detalle: string;
  activa: boolean;
  estado: string;
  tipo: 'aire' | 'agua';
}) {
  return (
    <li className={`live-act ${tipo}${activa ? ' on' : ''}`}>
      <span className="act-ico"><Icon name={icon} /></span>
      <div><strong>{titulo}</strong><span>{detalle}</span></div>
      <span className="act-estado">{activa ? estado : 'En reposo'}</span>
    </li>
  );
}

function Suelo({ titulo, nombre, valores }: { titulo: string; nombre: string; valores: number[] }) {
  return (
    <div className="live-soil">
      <p className="live-label"><Icon name="drop" />{titulo}</p>
      <ul>
        {valores.map((h, i) => (
          <li key={i} className={h < humedadMinima ? 'seco' : undefined}>
            <span>{nombre} {i + 1}</span>
            <span className="soil-bar"><span style={{ width: `${h}%` }} /></span>
            <span className="soil-val">{h}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const lista = (nums: number[], uno: string, varios: string) =>
  nums.length === 1 ? `${uno} ${nums[0]}` : `${varios} ${nums.slice(0, -1).join(', ')} y ${nums[nums.length - 1]}`;

export default function Live() {
  const { interior, exterior } = enVivo;
  const ventOn = interior.ventiladores.filter(Boolean).length;
  const mesas = interior.riego.flatMap((on, i) => (on ? [i + 1] : []));
  const canteros = exterior.riego.flatMap((on, i) => (on ? [i + 1] : []));

  return (
    <section className="section alt" id="en-vivo">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow eyebrow-green live-eyebrow"><span className="live-dot" />En vivo</p>
          <h2>El vivero,<br />ahora mismo.</h2>
          <p className="lead">
            Sensores en el invernadero y en la huerta miden la temperatura y la humedad. Desde acá podés ver qué está pasando: si se está regando o ventilando.
          </p>
        </header>

        <Plano />

        <div className="live reveal" style={{ '--d': '.1s' } as React.CSSProperties}>
          <div className="live-side">
            <div className="live-head">
              <span className="chip chip-green"><Icon name="greenhouse" /></span>
              <div><h3>Interior</h3><p>Invernadero</p></div>
            </div>
            <div className="live-stats">
              <Dato icon="thermo" label="Temperatura" value={uno(interior.temperatura)} unit="°C" />
              <Dato icon="drop" label="Humedad" value={String(interior.humedad)} unit="%" />
            </div>
            <ul className="live-acts">
              <Actividad
                icon="fan" tipo="aire" titulo="Ventilación" activa={ventOn > 0} estado="Ventilando"
                detalle={`${ventOn} de ${interior.ventiladores.length} ventiladores encendidos`}
              />
              <Actividad
                icon="drop" tipo="agua" titulo="Riego" activa={mesas.length > 0} estado="Regando"
                detalle={mesas.length ? `Regando ${lista(mesas, 'la mesa', 'las mesas')}` : 'Ninguna mesa se está regando'}
              />
            </ul>
            <Suelo titulo="Humedad de la tierra" nombre="Mesa" valores={interior.suelo} />
          </div>

          <div className="live-side">
            <div className="live-head">
              <span className="chip chip-green"><Icon name="sprout" /></span>
              <div><h3>Exterior</h3><p>Huerta y estación meteorológica</p></div>
            </div>
            <div className="live-stats">
              <Dato icon="thermo" label="Temperatura" value={uno(exterior.temperatura)} unit="°C" />
              <Dato icon="drop" label="Humedad" value={String(exterior.humedad)} unit="%" />
              <Dato icon="wind" label={`Viento ${exterior.direccionViento}`} value={String(exterior.viento)} unit="km/h" />
              <Dato icon="rain" label="Lluvia" value={uno(exterior.precipitacion)} unit="mm" />
            </div>
            <ul className="live-acts">
              <Actividad
                icon="drop" tipo="agua" titulo="Riego" activa={canteros.length > 0} estado="Regando"
                detalle={canteros.length ? `Regando ${lista(canteros, 'el cantero', 'los canteros')}` : 'Ningún cantero se está regando'}
              />
            </ul>
            <Suelo titulo="Humedad de la tierra" nombre="Cantero" valores={exterior.suelo} />
          </div>
        </div>

        {enVivo.demo && <p className="live-note">Vista previa con datos de ejemplo. Pronto se van a mostrar las mediciones reales.</p>}
      </div>
    </section>
  );
}

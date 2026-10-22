import type { Estacion as DatosEstacion } from '@/lib/data';
import { estadoLluvia, puntoCardinal, uno } from '@/lib/format';
import { Icon } from '../Icon';

const marcas = Array.from({ length: 72 }, (_, i) => i * 5);

function Brujula({ grados, velocidad }: { grados: number; velocidad: number }) {
  return (
    <div className="brujula">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        {marcas.map(g => (
          <line
            key={g}
            x1="100" y1="8" x2="100" y2={g % 45 === 0 ? 20 : 14}
            className={g % 90 === 0 ? 'marca fuerte' : 'marca'}
            transform={`rotate(${g} 100 100)`}
          />
        ))}
        {['N', 'E', 'S', 'O'].map((p, i) => {
          const a = (i * 90 - 90) * Math.PI / 180;
          return <text key={p} x={100 + Math.cos(a) * 70} y={100 + Math.sin(a) * 70} className="punto">{p}</text>;
        })}
        <g className="aguja" style={{ transform: `rotate(${grados}deg)` }}>
          <path d="M100 18 L107 40 L93 40 Z" />
          <line x1="100" y1="40" x2="100" y2="182" />
          <circle cx="100" cy="182" r="5" />
        </g>
      </svg>
      <div className="brujula-centro">
        <strong>{Math.round(velocidad)}</strong>
        <span>km/h</span>
      </div>
    </div>
  );
}

export default function Estacion({ datos }: { datos: DatosEstacion }) {
  const { temperatura, velocidadViento, direccionViento, humedad, precipitacion } = datos;
  return (
    <div className="widgets">
      <article className="card widget clima">
        <p className="dato-label"><Icon name="thermo" />Temperatura</p>
        <p className="clima-valor">{Math.round(temperatura)}°</p>
        <p className="clima-txt">Exterior · {uno(temperatura)} °C</p>
        <div className="clima-pie">
          <span><Icon name="drop" />{Math.round(humedad)}%</span>
          <span><Icon name="wind" />{Math.round(velocidadViento)} km/h {puntoCardinal(direccionViento)}</span>
          <span><Icon name="rain" />{uno(precipitacion)} mm</span>
        </div>
      </article>

      <article className="card widget">
        <p className="dato-label"><Icon name="wind" />Viento</p>
        <Brujula grados={direccionViento} velocidad={velocidadViento} />
        <p className="widget-pie">Desde el {puntoCardinal(direccionViento, true)} · {Math.round(direccionViento)}°</p>
      </article>

      <article className="card widget">
        <p className="dato-label"><Icon name="drop" />Humedad</p>
        <p className="dato-valor">{Math.round(humedad)}<small>%</small></p>
        <div className="barra agua"><span style={{ left: `${humedad}%` }} /></div>
        <p className="widget-pie">Humedad relativa del aire</p>
      </article>

      <article className="card widget">
        <p className="dato-label"><Icon name="rain" />Precipitación</p>
        <p className="dato-valor">{uno(precipitacion)}<small>mm</small></p>
        <p className="widget-pie">{estadoLluvia(precipitacion)}</p>
      </article>

      <article className="card widget">
        <p className="dato-label"><Icon name="compass" />Dirección del viento</p>
        <p className="dato-valor">{puntoCardinal(direccionViento)}<small>{Math.round(direccionViento)}°</small></p>
        <p className="widget-pie">Velocidad {Math.round(velocidadViento)} km/h</p>
      </article>
    </div>
  );
}

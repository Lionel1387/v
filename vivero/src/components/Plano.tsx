import { enVivo, humedadMinima } from '@/lib/data';

// Plano del vivero visto desde arriba. Muestra en vivo qué válvulas riegan y qué ventiladores giran,
// con los mismos datos que la sección "En vivo". Las posiciones salen de las fotos del invernadero:
// si la numeración real de mesas, ventiladores o canteros es otra, alcanza con reordenar estas listas.

const G = { x: 100, y: 50, w: 600, h: 420 }; // invernadero
const PUERTA = { x: 370, w: 60 };              // en la pared de abajo (frente)

// Mesa 1 a 6: fila del fondo de izquierda a derecha, después la fila de adelante
const MESAS = [
  { x: 170, y: 105 }, { x: 355, y: 105 }, { x: 540, y: 105 },
  { x: 170, y: 280 }, { x: 355, y: 280 }, { x: 540, y: 280 },
];
const MESA = { w: 90, h: 140 }; // angostas y a lo largo del invernadero

// Ventilador 1 y 2 en la pared del fondo, 3 y 4 en la pared de la puerta
const VENTILADORES = [
  { x: 270, y: G.y, afuera: -1 }, { x: 530, y: G.y, afuera: -1 },
  { x: 270, y: G.y + G.h, afuera: 1 }, { x: 530, y: G.y + G.h, afuera: 1 },
];

// Canteros de la huerta, frente al invernadero
const CANTEROS = [110, 260, 410, 560].map(x => ({ x, y: 545 }));
const CANTERO = { w: 120, h: 165 };

const pct = (n: number) => `${Math.round(n)} %`;

function Ventilador({ x, y, afuera, on, n }: { x: number; y: number; afuera: number; on: boolean; n: number }) {
  return (
    <g className={`fan${on ? ' on' : ''}`} transform={`translate(${x} ${y})`}>
      {/* persiana al costado, como en el invernadero real */}
      <rect x="30" y="-6" width="40" height="12" rx="2" fill="url(#persiana)" stroke="#8f9aa3" />
      {[-12, 0, 12].map(dx => (
        <path
          key={dx}
          className="flujo"
          d={`M${dx - 6} ${afuera * 30} l6 ${afuera * 7} l6 ${-afuera * 7}`}
          style={{ '--dy': `${afuera * 14}px` } as React.CSSProperties}
        />
      ))}
      <circle r="22" fill="#fff" stroke="#8f9aa3" strokeWidth="2" />
      <g className="aspas">
        {[0, 120, 240].map(a => <ellipse key={a} cx="0" cy="-10" rx="5.5" ry="10" fill="#d64541" transform={`rotate(${a})`} />)}
        <circle r="4" fill="#6b7780" />
      </g>
      <text className="plano-tag" x="0" y={afuera * -34} textAnchor="middle" dominantBaseline="central">V{n}</text>
    </g>
  );
}

function Mesa({ x, y, n, regando, humedad }: { x: number; y: number; n: number; regando: boolean; humedad: number }) {
  const cx = x + MESA.w / 2;
  const cy = y + MESA.h / 2 + 4;
  const bw = (MESA.w - 36) / 2; // medio ancho y medio alto del brazo de riego
  const bh = (MESA.h - 76) / 2;
  const boquillas = [[-bw, -bh], [bw, -bh], [-bw, bh], [bw, bh], [0, -bh], [0, bh], [-bw, 0], [bw, 0]];
  const seca = humedad < humedadMinima;
  return (
    <g className={`mesa${regando ? ' on' : ''}`}>
      <rect x={x} y={y} width={MESA.w} height={MESA.h} rx="4" fill="#a8602d" />
      <rect x={x + 7} y={y + 7} width={MESA.w - 14} height={MESA.h - 14} fill="url(#malla)" />
      <rect className="mesa-agua" x={x + 7} y={y + 7} width={MESA.w - 14} height={MESA.h - 14} />
      {/* brazo de riego colgado sobre la mesa */}
      <g className="brazo">
        <rect x={cx - bw} y={cy - bh} width={bw * 2} height={bh * 2} rx="5" fill="none" />
        <path d={`M${cx - bw} ${cy}H${cx + bw}M${cx} ${cy - bh}V${cy + bh}`} />
        <circle cx={cx} cy={cy} r="6" fill="#5b6770" />
      </g>
      {boquillas.map(([dx, dy], i) => (
        <g key={i}>
          {regando && <circle className="gota" cx={cx + dx} cy={cy + dy} r="5" style={{ animationDelay: `${(i % 4) * 0.35}s` }} />}
          <circle className="boquilla" cx={cx + dx} cy={cy + dy} r="3.5" />
        </g>
      ))}
      <text className="plano-label" x={x + 14} y={y + 24}>Mesa {n}</text>
      <text className={`plano-valor${seca ? ' seco' : ''}`} x={x + MESA.w - 14} y={y + MESA.h - 14} textAnchor="end">{pct(humedad)}</text>
    </g>
  );
}

function Cantero({ x, y, n, regando, humedad }: { x: number; y: number; n: number; regando: boolean; humedad: number }) {
  const lineas = [x + 40, x + 80];
  const seca = humedad < humedadMinima;
  return (
    <g className={`cantero${regando ? ' on' : ''}`}>
      <rect className="cantero-borde" x={x} y={y} width={CANTERO.w} height={CANTERO.h} rx="3" fill="#7a5a3c" strokeWidth="6" />
      <rect className="cantero-agua" x={x + 3} y={y + 3} width={CANTERO.w - 6} height={CANTERO.h - 6} />
      {lineas.map((lx, j) => (
        <g key={lx}>
          {[0, 1, 2, 3].map(i => <circle key={i} cx={lx + (i % 2 ? 7 : -7)} cy={y + 46 + i * 24} r="7" fill="#5fae4e" />)}
          <path className="goteo" d={`M${lx} ${y + 34}V${y + CANTERO.h - 12}`} />
          {regando && [0, 1, 2, 3].map(i => (
            <circle key={i} className="gota" cx={lx} cy={y + 46 + i * 24} r="4" style={{ animationDelay: `${((i + j) % 4) * 0.35}s` }} />
          ))}
        </g>
      ))}
      <text className="plano-label" x={x + 12} y={y + 22}>Cantero {n}</text>
      <text className={`plano-valor${seca ? ' seco' : ''}`} x={x + CANTERO.w - 12} y={y + CANTERO.h - 12} textAnchor="end">{pct(humedad)}</text>
    </g>
  );
}

export default function Plano() {
  const { interior, exterior } = enVivo;
  const mesasRegando = interior.riego.flatMap((on, i) => (on ? [i + 1] : []));
  const ventOn = interior.ventiladores.filter(Boolean).length;
  const resumen =
    `Plano del vivero visto desde arriba. ${ventOn} de ${interior.ventiladores.length} ventiladores encendidos. ` +
    (mesasRegando.length ? `Regando mesa ${mesasRegando.join(', ')}.` : 'Ninguna mesa se está regando.');

  const paredAbajo = G.y + G.h;

  return (
    <div className="plano reveal">
      <div className="plano-scroll">
        <svg viewBox="85 0 900 740" role="img" aria-label={resumen}>
          <defs>
            <pattern id="grava" width="14" height="14" patternUnits="userSpaceOnUse">
              <rect width="14" height="14" fill="#f1efea" />
              <circle cx="3" cy="4" r="1.6" fill="#d6d1c6" />
              <circle cx="10" cy="10" r="1.3" fill="#ddd8cd" />
            </pattern>
            <pattern id="malla" width="9" height="9" patternUnits="userSpaceOnUse">
              <rect width="9" height="9" fill="#3a2b22" />
              <path d="M0 4.5 4.5 0 9 4.5 4.5 9z" fill="none" stroke="#6b4a33" strokeWidth=".9" />
            </pattern>
            <pattern id="chapa" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#c9cfd4" />
              <rect width="3" height="8" fill="#b7bec4" />
            </pattern>
            <pattern id="persiana" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#e3e7ea" />
              <rect width="4" height="1.5" fill="#a9b2b9" />
            </pattern>
          </defs>

          {/* Invernadero */}
          <rect x={G.x} y={G.y} width={G.w} height={G.h} fill="url(#grava)" />
          <path className="cumbrera" d={`M${G.x + G.w / 2} ${G.y}V${paredAbajo}`} />
          <path
            className="pared"
            d={`M${PUERTA.x} ${paredAbajo}H${G.x}V${G.y}H${G.x + G.w}V${paredAbajo}H${PUERTA.x + PUERTA.w}`}
          />
          {/* ventanas laterales */}
          {[160, 330].map(vy => (
            <g key={vy} className="ventana">
              <path d={`M${G.x} ${vy}v90`} />
              <path d={`M${G.x + G.w} ${vy}v90`} />
            </g>
          ))}
          {/* puerta */}
          <path className="puerta" d={`M${PUERTA.x} ${paredAbajo}l${PUERTA.w * 0.7} ${PUERTA.w * 0.7}`} />
          <path className="puerta-arco" d={`M${PUERTA.x + PUERTA.w} ${paredAbajo}A${PUERTA.w} ${PUERTA.w} 0 0 1 ${PUERTA.x + PUERTA.w * 0.7} ${paredAbajo + PUERTA.w * 0.7}`} />
          <text className="plano-zona" x={G.x + 14} y={G.y + 28}>INVERNADERO</text>
          <text className="plano-nota" x={PUERTA.x + PUERTA.w / 2} y={paredAbajo - 12} textAnchor="middle">Puerta</text>

          {MESAS.map((m, i) => (
            <Mesa key={i} {...m} n={i + 1} regando={interior.riego[i]} humedad={interior.suelo[i]} />
          ))}
          {VENTILADORES.map((v, i) => (
            <Ventilador key={i} {...v} n={i + 1} on={interior.ventiladores[i]} />
          ))}
          {/* Sala técnica y panel solar */}
          <rect x="755" y="70" width="135" height="175" fill="url(#chapa)" stroke="#8f9aa3" strokeWidth="2" />
          <text className="plano-nota" x="822" y="268" textAnchor="middle">Sala técnica</text>
          <g transform="translate(905 190)">
            <rect width="54" height="36" rx="2" fill="#2d4a7a" stroke="#1d3256" />
            <path d="M18 0v36M36 0v36M0 18h54" stroke="#5f7fb3" strokeWidth="1" />
          </g>
          <text className="plano-nota" x="932" y="250" textAnchor="middle">Panel solar</text>

          {/* Huerta */}
          <text className="plano-zona" x="110" y="530">HUERTA</text>
          {CANTEROS.map((c, i) => (
            <Cantero key={i} {...c} n={i + 1} regando={exterior.riego[i]} humedad={exterior.suelo[i]} />
          ))}

          {/* Estación meteorológica */}
          <g transform="translate(860 610)">
            <circle r="34" fill="#fff" stroke="#c9cfd4" strokeWidth="2" />
            <path d="M0 -16V18M-14 -16H14" stroke="#6b7780" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="-14" cy="-16" r="5" fill="#6b7780" />
            <circle cx="14" cy="-16" r="5" fill="#6b7780" />
            <text className="plano-nota" x="0" y="56" textAnchor="middle">Estación meteorológica</text>
            <text className="plano-nota fuerte" x="0" y="78" textAnchor="middle">
              {exterior.temperatura.toLocaleString('es-AR')} °C · {exterior.viento} km/h
            </text>
          </g>
        </svg>
      </div>

      <ul className="plano-leyenda">
        <li><span className="ley agua" />Regando</li>
        <li><span className="ley aire" />Ventilador encendido</li>
        <li><span className="ley seco" />Tierra seca</li>
        <li><span className="ley off" />Apagado</li>
      </ul>
    </div>
  );
}

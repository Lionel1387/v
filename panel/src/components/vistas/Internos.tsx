import type { Automatico, Invernadero } from '@/lib/data';
import type { GrupoValvulas } from '@/lib/useInvernadero';
import { haceCuanto, uno } from '@/lib/format';
import { Icon } from '../Icon';
import { BotonAuto, BotonGeneral, Grupo, TarjetaEquipo, TarjetaHumedad } from '../ui';

export default function Internos({ datos, ahora, humedadMin, setVentilador, setValvula, setAutomatico }: {
  datos: Invernadero;
  ahora: number;
  humedadMin: number;
  setVentilador: (id: number | 'todos', v: boolean) => void;
  setValvula: (grupo: GrupoValvulas, id: number | 'todas', v: boolean) => void;
  setAutomatico: (grupo: keyof Automatico, v: boolean) => void;
}) {
  const { ambiente, ventiladores, valvulasInternas, humedadMesas, automatico } = datos;
  const ventOn = ventiladores.filter(v => v.encendido).length;
  const valvOn = valvulasInternas.filter(v => v.encendida).length;
  const secas = humedadMesas.filter(s => s.humedad < humedadMin).length;

  const detalleVent = `${ventOn} de ${ventiladores.length} encendidos`;
  const detalleValv = valvOn ? `${valvOn} regando ahora` : 'Riego por goteo de cada mesa';

  return (
    <>
      <Grupo titulo="Ambiente" detalle="Temperatura y humedad del aire dentro del invernadero" icono="greenhouse">
        <div className="grid g2">
          <article className="card dato">
            <p className="dato-label"><Icon name="thermo" />Temperatura</p>
            <p className="dato-valor">{uno(ambiente.temperatura)}<small>°C</small></p>
            <div className="barra calor"><span style={{ left: `${Math.min(100, Math.max(0, (ambiente.temperatura - 5) / 40 * 100))}%` }} /></div>
          </article>
          <article className="card dato">
            <p className="dato-label"><Icon name="drop" />Humedad relativa</p>
            <p className="dato-valor">{Math.round(ambiente.humedad)}<small>%</small></p>
            <div className="barra agua"><span style={{ left: `${ambiente.humedad}%` }} /></div>
          </article>
        </div>
      </Grupo>

      <Grupo
        titulo="Ventilación"
        detalle={automatico.ventilacion ? `Automático · ${detalleVent}` : detalleVent}
        icono="fan"
        accion={<>
          <BotonAuto activo={automatico.ventilacion} onChange={v => setAutomatico('ventilacion', v)} />
          <BotonGeneral disabled={automatico.ventilacion} todos={ventOn === ventiladores.length} onChange={v => setVentilador('todos', v)} encender="Encender todos" apagar="Apagar todos" />
        </>}
      >
        <div className="grid g4">
          {ventiladores.map(v => (
            <TarjetaEquipo
              key={v.id}
              icono="fan"
              animacion="girar"
              nombre={v.nombre}
              encendido={v.encendido}
              automatico={automatico.ventilacion}
              estado={v.encendido ? 'Encendido' : 'Apagado'}
              onChange={on => setVentilador(v.id, on)}
            />
          ))}
        </div>
      </Grupo>

      <Grupo
        titulo="Electroválvulas"
        detalle={automatico.riegoInterno ? `Automático · ${detalleValv}` : detalleValv}
        icono="valve"
        accion={<>
          <BotonAuto activo={automatico.riegoInterno} onChange={v => setAutomatico('riegoInterno', v)} />
          <BotonGeneral disabled={automatico.riegoInterno} todos={valvOn === valvulasInternas.length} onChange={v => setValvula('valvulasInternas', 'todas', v)} encender="Encender todas" apagar="Apagar todas" />
        </>}
      >
        <div className="grid g3">
          {valvulasInternas.map(v => (
            <TarjetaEquipo
              key={v.id}
              icono="valve"
              animacion="gotear"
              nombre={`Electroválvula ${v.id}`}
              encendido={v.encendida}
              automatico={automatico.riegoInterno}
              estado={v.encendida ? `Regando ${v.nombre.toLowerCase()}` : v.nombre}
              detalle={<><Icon name="clock" />Último encendido: {haceCuanto(v.ultimaActivacion, ahora).toLowerCase()}</>}
              onChange={on => setValvula('valvulasInternas', v.id, on)}
            />
          ))}
        </div>
      </Grupo>

      <Grupo
        titulo="Humedad por mesa"
        detalle={secas ? `${secas} ${secas === 1 ? 'mesa necesita' : 'mesas necesitan'} riego (menos de ${humedadMin} %)` : 'Todas las mesas tienen buena humedad'}
        icono="drop"
      >
        <div className="grid g3">
          {humedadMesas.map(s => <TarjetaHumedad key={s.id} nombre={s.nombre} humedad={s.humedad} min={humedadMin} />)}
        </div>
      </Grupo>
    </>
  );
}

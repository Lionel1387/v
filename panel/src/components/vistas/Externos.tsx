import type { Automatico, Invernadero } from '@/lib/data';
import type { GrupoValvulas } from '@/lib/useInvernadero';
import { umbralCantero, type RiegoExterno } from '@/lib/config';
import { haceCuanto } from '@/lib/format';
import { Icon } from '../Icon';
import { BotonAuto, BotonGeneral, Grupo, TarjetaEquipo, TarjetaHumedad } from '../ui';

export default function Externos({ datos, ahora, riego, setValvula, setAutomatico }: {
  datos: Invernadero;
  ahora: number;
  riego: RiegoExterno;
  setValvula: (grupo: GrupoValvulas, id: number | 'todas', v: boolean) => void;
  setAutomatico: (grupo: keyof Automatico, v: boolean) => void;
}) {
  const { valvulasExternas, humedadCanteros, automatico } = datos;
  const valvOn = valvulasExternas.filter(v => v.encendida).length;
  const secos = humedadCanteros.filter((s, i) => s.humedad < umbralCantero(riego, i)).length;
  const detalleValv = valvOn ? `${valvOn} ${valvOn === 1 ? 'cantero regando' : 'canteros regando'} ahora` : 'Una por cantero';

  return (
    <>
      <Grupo
        titulo="Electroválvulas"
        detalle={automatico.riegoExterno ? `Automático · ${detalleValv}` : detalleValv}
        icono="valve"
        accion={<>
          <BotonAuto activo={automatico.riegoExterno} onChange={v => setAutomatico('riegoExterno', v)} />
          <BotonGeneral disabled={automatico.riegoExterno} todos={valvOn === valvulasExternas.length} onChange={v => setValvula('valvulasExternas', 'todas', v)} encender="Encender todas" apagar="Apagar todas" />
        </>}
      >
        <div className="grid g4">
          {valvulasExternas.map(v => (
            <TarjetaEquipo
              key={v.id}
              icono="valve"
              animacion="gotear"
              nombre={v.nombre}
              encendido={v.encendida}
              automatico={automatico.riegoExterno}
              estado={v.encendida ? 'Regando' : 'Cerrada'}
              detalle={<><Icon name="clock" />{haceCuanto(v.ultimaActivacion, ahora)}</>}
              onChange={on => setValvula('valvulasExternas', v.id, on)}
            />
          ))}
        </div>
      </Grupo>

      <Grupo
        titulo="Humedad de los canteros"
        detalle={secos ? `${secos} ${secos === 1 ? 'cantero necesita' : 'canteros necesitan'} riego` : 'Todos los canteros tienen buena humedad'}
        icono="drop"
      >
        <div className="grid g4">
          {humedadCanteros.map((s, i) => <TarjetaHumedad key={s.id} nombre={s.nombre} humedad={s.humedad} min={umbralCantero(riego, i)} />)}
        </div>
      </Grupo>
    </>
  );
}

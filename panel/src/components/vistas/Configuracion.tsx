import { useState } from 'react';
import type { Configuracion as Config, ReglasCantero, RiegoExterno, RiegoInterno, Ventilacion } from '@/lib/config';
import { uno } from '@/lib/format';
import { Dias, Fila, FilaRegla, Franjas, Lista, Rango, Segmentado, Stepper } from '../ajustes';

type Seccion = 'interno' | 'externo' | 'ventilacion';

const secciones: { valor: Seccion; texto: string }[] = [
  { valor: 'interno', texto: 'Riego interno' },
  { valor: 'externo', texto: 'Riego externo' },
  { valor: 'ventilacion', texto: 'Ventilación' },
];

const aviso = (texto: string) => <span className="aviso">{texto}</span>;

export default function Configuracion({ config, setConfig, restablecer }: {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  restablecer: () => void;
}) {
  const [seccion, setSeccion] = useState<Seccion>('interno');

  const setInterno = (p: Partial<RiegoInterno>) => setConfig(c => ({ ...c, riegoInterno: { ...c.riegoInterno, ...p } }));
  const setExterno = (p: Partial<RiegoExterno>) => setConfig(c => ({ ...c, riegoExterno: { ...c.riegoExterno, ...p } }));
  const setVentilacion = (p: Partial<Ventilacion>) => setConfig(c => ({ ...c, ventilacion: { ...c.ventilacion, ...p } }));

  return (
    <>
      <div className="ajustes-barra">
        <Segmentado label="Sección de configuración" opciones={secciones} valor={seccion} onChange={setSeccion} />
        <button
          type="button"
          className="pill"
          onClick={() => { if (confirm('¿Volver toda la configuración a los valores iniciales?')) restablecer(); }}
        >
          Restablecer valores
        </button>
      </div>

      {seccion === 'interno' && <AjustesInterno cfg={config.riegoInterno} set={setInterno} />}
      {seccion === 'externo' && <AjustesExterno cfg={config.riegoExterno} set={setExterno} />}
      {seccion === 'ventilacion' && <AjustesVentilacion cfg={config.ventilacion} set={setVentilacion} />}
    </>
  );
}

function AjustesInterno({ cfg, set }: { cfg: RiegoInterno; set: (p: Partial<RiegoInterno>) => void }) {
  const objetivoInvalido = cfg.corte === 'humedad' && cfg.humedadObjetivo <= cfg.humedadMin;

  return (
    <div className="ajustes">
      <Lista
        titulo="Inicio y fin del riego"
        pie={objetivoInvalido
          ? aviso(`La humedad objetivo tiene que ser mayor que la mínima (${cfg.humedadMin} %).`)
          : 'Cada mesa se riega por separado, según su propio sensor de humedad.'}
      >
        <Fila etiqueta="Humedad mínima del suelo" detalle="Por debajo de este valor se abre la electroválvula de la mesa">
          <Stepper label="humedad mínima" valor={cfg.humedadMin} onChange={humedadMin => set({ humedadMin })} min={0} max={100} unidad="%" />
        </Fila>
        <Fila etiqueta="Detener el riego">
          <Segmentado
            label="Detener el riego"
            valor={cfg.corte}
            onChange={corte => set({ corte })}
            opciones={[{ valor: 'humedad', texto: 'Por humedad' }, { valor: 'tiempo', texto: 'Por tiempo' }]}
          />
        </Fila>
        {cfg.corte === 'humedad' ? (
          <Fila etiqueta="Humedad objetivo" detalle="Al alcanzarla se cierra la electroválvula">
            <Stepper label="humedad objetivo" valor={cfg.humedadObjetivo} onChange={humedadObjetivo => set({ humedadObjetivo })} min={0} max={100} unidad="%" />
          </Fila>
        ) : (
          <Fila etiqueta="Duración del riego" detalle="Tiempo que queda abierta la electroválvula en cada ciclo">
            <Stepper label="duración del riego" valor={cfg.duracionRiego} onChange={duracionRiego => set({ duracionRiego })} min={1} max={120} unidad="min" />
          </Fila>
        )}
      </Lista>

      <Lista titulo="Límites" pie="Protegen las mesas si un sensor falla o da lecturas erróneas.">
        <Fila etiqueta="Espera entre ciclos" detalle="Tiempo mínimo desde que termina un riego hasta que puede empezar otro">
          <Stepper label="espera entre ciclos" valor={cfg.esperaEntreCiclos} onChange={esperaEntreCiclos => set({ esperaEntreCiclos })} min={0} max={1440} paso={5} unidad="min" />
        </Fila>
        <Fila etiqueta="Máximo diario" detalle="Tiempo total de riego por mesa en un mismo día">
          <Stepper label="máximo diario" valor={cfg.maxDiario} onChange={maxDiario => set({ maxDiario })} min={1} max={600} paso={5} unidad="min" />
        </Fila>
      </Lista>

      <Lista titulo="Tiempo máximo por electroválvula" pie="Al llegar a este tiempo la electroválvula se cierra, aunque la mesa no haya alcanzado la humedad objetivo.">
        {cfg.maxPorValvula.map((m, i) => (
          <Fila key={i} etiqueta={`Electroválvula ${i + 1}`} detalle={`Mesa ${i + 1}`}>
            <Stepper
              label={`tiempo máximo de la electroválvula ${i + 1}`}
              valor={m}
              onChange={v => set({ maxPorValvula: cfg.maxPorValvula.map((x, j) => (j === i ? v : x)) })}
              min={1}
              max={120}
              unidad="min"
            />
          </Fila>
        ))}
      </Lista>

      <Lista titulo="Horarios permitidos" pie="El riego automático solo arranca dentro de las franjas activas.">
        <Franjas franjas={cfg.horarios} onChange={horarios => set({ horarios })} vacio="Sin franjas: se puede regar a cualquier hora" agregar="Agregar horario" />
      </Lista>

      <Lista titulo="Horarios bloqueados" pie="En estas franjas no se riega automáticamente, aunque estén dentro de un horario permitido. Sirve, por ejemplo, para evitar las horas de más calor.">
        <Franjas franjas={cfg.bloqueos} onChange={bloqueos => set({ bloqueos })} vacio="Sin horarios bloqueados" agregar="Agregar bloqueo" />
      </Lista>

      <Lista titulo="Días de la semana" pie={cfg.dias.some(Boolean) ? 'Días en los que funciona el riego automático.' : aviso('Sin días elegidos, el riego automático no se activa nunca.')}>
        <Fila etiqueta="Días permitidos" ancha>
          <Dias valor={cfg.dias} onChange={dias => set({ dias })} />
        </Fila>
      </Lista>
    </div>
  );
}

function AjustesExterno({ cfg, set }: { cfg: RiegoExterno; set: (p: Partial<RiegoExterno>) => void }) {
  const [cantero, setCantero] = useState(0);
  const individual = cfg.modo === 'individual';
  const reglas = individual ? cfg.canteros[cantero] : cfg.global;

  function setReglas(nuevas: ReglasCantero) {
    if (individual) set({ canteros: cfg.canteros.map((r, i) => (i === cantero ? nuevas : r)) });
    else set({ global: nuevas });
  }
  function valor<K extends keyof ReglasCantero>(clave: K, v: ReglasCantero[K]['valor']) {
    setReglas({ ...reglas, [clave]: { ...reglas[clave], valor: v } });
  }
  function habilitar(clave: keyof ReglasCantero, activa: boolean) {
    setReglas({ ...reglas, [clave]: { ...reglas[clave], activa } });
  }

  const invalido = reglas.humedadMin.activa && reglas.humedadObjetivo.activa && reglas.humedadObjetivo.valor <= reglas.humedadMin.valor;

  return (
    <div className="ajustes">
      <Lista
        titulo="Alcance"
        pie={individual ? 'Cada cantero tiene sus propias reglas. Elegí el cantero que querés ajustar.' : 'Las mismas reglas valen para los cuatro canteros.'}
      >
        <Fila etiqueta="Aplicar reglas">
          <Segmentado
            label="Aplicar reglas"
            valor={cfg.modo}
            onChange={modo => set({ modo })}
            opciones={[{ valor: 'global', texto: 'A todos' }, { valor: 'individual', texto: 'Por cantero' }]}
          />
        </Fila>
        {individual && (
          <>
            <Fila etiqueta="Cantero">
              <Segmentado
                label="Cantero"
                valor={String(cantero)}
                onChange={v => setCantero(Number(v))}
                opciones={cfg.canteros.map((_, i) => ({ valor: String(i), texto: String(i + 1) }))}
              />
            </Fila>
            <button type="button" className="fila fila-agregar" onClick={() => setReglas(cfg.global)}>
              Copiar las reglas generales a este cantero
            </button>
          </>
        )}
      </Lista>

      <Lista
        titulo={individual ? `Reglas del cantero ${cantero + 1}` : 'Reglas de riego'}
        pie={invalido
          ? aviso('La humedad objetivo tiene que ser mayor que la mínima.')
          : 'Cada regla se habilita o deshabilita con su interruptor. Las deshabilitadas no se tienen en cuenta.'}
      >
        <FilaRegla etiqueta="Humedad mínima para iniciar" detalle="Por debajo se abre la electroválvula" activa={reglas.humedadMin.activa} onActiva={a => habilitar('humedadMin', a)}>
          <Stepper label="humedad mínima" valor={reglas.humedadMin.valor} onChange={v => valor('humedadMin', v)} min={0} max={100} unidad="%" />
        </FilaRegla>
        <FilaRegla etiqueta="Humedad objetivo para detener" detalle="Al alcanzarla se cierra la electroválvula" activa={reglas.humedadObjetivo.activa} onActiva={a => habilitar('humedadObjetivo', a)}>
          <Stepper label="humedad objetivo" valor={reglas.humedadObjetivo.valor} onChange={v => valor('humedadObjetivo', v)} min={0} max={100} unidad="%" />
        </FilaRegla>
        <FilaRegla etiqueta="Duración máxima por ciclo" activa={reglas.duracionMax.activa} onActiva={a => habilitar('duracionMax', a)}>
          <Stepper label="duración máxima por ciclo" valor={reglas.duracionMax.valor} onChange={v => valor('duracionMax', v)} min={1} max={180} unidad="min" />
        </FilaRegla>
        <FilaRegla etiqueta="Espera entre ciclos" activa={reglas.espera.activa} onActiva={a => habilitar('espera', a)}>
          <Stepper label="espera entre ciclos" valor={reglas.espera.valor} onChange={v => valor('espera', v)} min={0} max={1440} paso={5} unidad="min" />
        </FilaRegla>
        <FilaRegla etiqueta="Horario permitido" activa={reglas.horario.activa} onActiva={a => habilitar('horario', a)}>
          <Rango desde={reglas.horario.valor.desde} hasta={reglas.horario.valor.hasta} onChange={r => valor('horario', r)} />
        </FilaRegla>
        <FilaRegla etiqueta="Días permitidos" activa={reglas.dias.activa} onActiva={a => habilitar('dias', a)} ancha>
          <Dias valor={reglas.dias.valor} onChange={v => valor('dias', v)} />
        </FilaRegla>
      </Lista>
    </div>
  );
}

function AjustesVentilacion({ cfg, set }: { cfg: Ventilacion; set: (p: Partial<Ventilacion>) => void }) {
  const invalido = cfg.tempApagar >= cfg.tempEncender;

  return (
    <div className="ajustes">
      <Lista
        titulo="Temperatura"
        pie={invalido
          ? aviso('La temperatura de apagado tiene que ser menor que la de encendido.')
          : `Entre ${uno(cfg.tempApagar)} y ${uno(cfg.tempEncender)} °C los ventiladores mantienen su estado, así no se prenden y apagan con cada pequeña variación.`}
      >
        <Fila etiqueta="Encender desde" detalle="Temperatura del aire dentro del invernadero">
          <Stepper label="temperatura de encendido" valor={cfg.tempEncender} onChange={tempEncender => set({ tempEncender })} min={10} max={45} paso={0.5} unidad="°C" />
        </Fila>
        <Fila etiqueta="Apagar por debajo de">
          <Stepper label="temperatura de apagado" valor={cfg.tempApagar} onChange={tempApagar => set({ tempApagar })} min={5} max={44} paso={0.5} unidad="°C" />
        </Fila>
      </Lista>

      <Lista titulo="Protección" pie="Evita que los ventiladores cambien de estado constantemente.">
        <Fila etiqueta="Tiempo mínimo entre cambios" detalle="Tiempo que tiene que pasar entre un encendido y un apagado, o al revés">
          <Stepper label="tiempo mínimo entre cambios" valor={cfg.tiempoMinimo} onChange={tiempoMinimo => set({ tiempoMinimo })} min={1} max={60} unidad="min" />
        </Fila>
      </Lista>

      <Lista titulo="Horarios permitidos" pie="Fuera de las franjas activas, los ventiladores no se encienden automáticamente.">
        <Franjas franjas={cfg.horarios} onChange={horarios => set({ horarios })} vacio="Sin franjas: pueden funcionar a cualquier hora" agregar="Agregar horario" />
      </Lista>
    </div>
  );
}

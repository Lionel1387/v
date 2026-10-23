import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Subject } from 'rxjs';
import { DB } from '../database/database.module';
import type { Estacion, GrupoAutomatico, Invernadero, SensorHumedad, Valvula } from './invernadero.types';

type Ubicacion = 'mesa' | 'cantero';

const ms = (fecha: Date | null) => (fecha ? fecha.getTime() : null);

@Injectable()
export class InvernaderoService {
  // Avisa que algo cambió desde la API, para mandar el estado nuevo a quien esté escuchando /eventos
  readonly cambios = new Subject<void>();

  constructor(@Inject(DB) private readonly db: Pool) {}

  private async filas<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const [rows] = await this.db.query<RowDataPacket[]>(sql, params);
    return rows as T[];
  }

  // Estado actual: equipos, última medición de cada sensor y último registro de estación y ambiente
  async estado(): Promise<Invernadero> {
    const [automatico, ventiladores, valvulas, sensores, estaciones, ambientes] = await Promise.all([
      this.filas<{ grupo: GrupoAutomatico; activo: number }>('SELECT grupo, activo FROM Modo_Automatico'),
      this.filas<{ id: number; nombre: string; estado: number }>(
        'SELECT id_ventilador AS id, nombre, estado FROM Ventilacion ORDER BY id_ventilador',
      ),
      this.filas<{ id: number; nombre: string; ubicacion: Ubicacion; estado: number; hora_activacion: Date | null }>(
        'SELECT id_electrovalvula AS id, nombre, ubicacion, estado, hora_activacion FROM Electrovalvula ORDER BY id_electrovalvula',
      ),
      this.filas<{ id: number; nombre: string; ubicacion: Ubicacion; registro_humedad: number | null }>(
        'SELECT id_cantero AS id, nombre, ubicacion, registro_humedad FROM Humedad_Suelo ORDER BY id_cantero',
      ),
      this.filas<{
        temperatura: number | null; velocidad_viento: number | null; direccion_viento: number | null;
        humedad: number | null; precipitacion: number | null; registrado_en: Date;
      }>('SELECT * FROM Estacion_Meteorologica ORDER BY id_registro_EM DESC LIMIT 1'),
      this.filas<{ temperatura: number | null; humedad: number | null; registrado_en: Date }>(
        'SELECT temperatura, humedad, registrado_en FROM Variables_ambientales ORDER BY id_registro DESC LIMIT 1',
      ),
    ]);

    const valvulasDe = (u: Ubicacion): Valvula[] => valvulas
      .filter(v => v.ubicacion === u)
      .map(v => ({ id: v.id, nombre: v.nombre, encendida: !!v.estado, ultimaActivacion: ms(v.hora_activacion) }));

    const sensoresDe = (u: Ubicacion): SensorHumedad[] => sensores
      .filter(s => s.ubicacion === u)
      .map(s => ({ id: s.id, nombre: s.nombre, humedad: s.registro_humedad ?? 0 }));

    const em = estaciones[0];
    const estacion: Estacion = {
      temperatura: em?.temperatura ?? 0,
      velocidadViento: em?.velocidad_viento ?? 0,
      direccionViento: em?.direccion_viento ?? 0,
      humedad: em?.humedad ?? 0,
      precipitacion: em?.precipitacion ?? 0,
    };
    const amb = ambientes[0];
    const activo = (g: GrupoAutomatico) => !!automatico.find(a => a.grupo === g)?.activo;

    return {
      automatico: { ventilacion: activo('ventilacion'), riegoInterno: activo('riegoInterno'), riegoExterno: activo('riegoExterno') },
      ventiladores: ventiladores.map(v => ({ id: v.id, nombre: v.nombre, encendido: !!v.estado })),
      valvulasInternas: valvulasDe('mesa'),
      humedadMesas: sensoresDe('mesa'),
      ambiente: { temperatura: amb?.temperatura ?? 0, humedad: amb?.humedad ?? 0 },
      valvulasExternas: valvulasDe('cantero'),
      humedadCanteros: sensoresDe('cantero'),
      estacion,
      // Momento de la medición más reciente
      actualizado: Math.max(em?.registrado_en.getTime() ?? 0, amb?.registrado_en.getTime() ?? 0) || Date.now(),
    };
  }

  async setVentilador(id: number | 'todos', encendido: boolean) {
    const [res] = await this.db.query<ResultSetHeader>(
      // cambiado_en va antes que estado: MySQL aplica los SET en orden y compara con el estado anterior
      `UPDATE Ventilacion
         SET cambiado_en = IF(estado <=> ?, cambiado_en, NOW()),
             horario_activacion = IF(? AND NOT (estado <=> TRUE), NOW(), horario_activacion),
             estado = ?
       ${id === 'todos' ? '' : 'WHERE id_ventilador = ?'}`,
      id === 'todos' ? [encendido, encendido, encendido] : [encendido, encendido, encendido, id],
    );
    if (!res.affectedRows) throw new NotFoundException('Ventilador inexistente');
    this.cambios.next();
  }

  // id es id_electrovalvula; tiene que pertenecer al grupo pedido
  async setValvula(ubicacion: Ubicacion, id: number | 'todas', encendida: boolean) {
    const ids = (await this.filas<{ id: number }>(
      'SELECT id_electrovalvula AS id FROM Electrovalvula WHERE ubicacion = ? ORDER BY id_electrovalvula',
      [ubicacion],
    )).map(v => v.id);
    const elegidas = id === 'todas' ? ids : ids.filter(v => v === id);
    if (!elegidas.length) throw new NotFoundException('Electroválvula inexistente');
    await this.cambiarValvulas(elegidas, encendida, false);
  }

  // Abre o cierra electroválvulas y deja registrado el ciclo de riego en Ciclo_Riego
  async cambiarValvulas(ids: number[], encendida: boolean, automatico: boolean) {
    if (!ids.length) return;
    const cambian = (await this.filas<{ id: number }>(
      'SELECT id_electrovalvula AS id FROM Electrovalvula WHERE id_electrovalvula IN (?) AND estado <> ?',
      [ids, encendida],
    )).map(v => v.id);
    if (!cambian.length) return;

    const con = await this.db.getConnection();
    try {
      await con.beginTransaction();
      if (encendida) {
        await con.query('INSERT INTO Ciclo_Riego (id_electrovalvula, automatico) VALUES ?', [cambian.map(v => [v, automatico])]);
      } else {
        await con.query('UPDATE Ciclo_Riego SET fin = NOW() WHERE fin IS NULL AND id_electrovalvula IN (?)', [cambian]);
      }
      // La hora de activación solo cambia cuando pasa de apagada a encendida
      await con.query(
        'UPDATE Electrovalvula SET hora_activacion = IF(?, NOW(), hora_activacion), estado = ? WHERE id_electrovalvula IN (?)',
        [encendida, encendida, cambian],
      );
      await con.commit();
    } catch (e) {
      await con.rollback();
      throw e;
    } finally {
      con.release();
    }
    this.cambios.next();
  }

  async setAutomatico(grupo: GrupoAutomatico, activo: boolean) {
    await this.db.execute(
      'INSERT INTO Modo_Automatico (grupo, activo) VALUES (?, ?) ON DUPLICATE KEY UPDATE activo = VALUES(activo)',
      [grupo, activo],
    );
    this.cambios.next();
  }
}

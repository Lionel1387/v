import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { DB } from '../database/database.module';
import type { Configuracion } from './configuracion.types';

const esObjeto = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

@Injectable()
export class ConfiguracionService {
  constructor(@Inject(DB) private readonly db: Pool) {}

  // null mientras nadie la haya guardado desde el panel
  async obtener(): Promise<Configuracion | null> {
    const [rows] = await this.db.query<RowDataPacket[]>('SELECT datos FROM Configuracion WHERE id = 1');
    if (!rows.length) return null;
    const datos: unknown = rows[0].datos;
    return (typeof datos === 'string' ? JSON.parse(datos) : datos) as Configuracion;
  }

  async guardar(cfg: unknown): Promise<void> {
    // Controla solo la forma general; el panel es el que arma el objeto completo
    if (!esObjeto(cfg) || !esObjeto(cfg.riegoInterno) || !esObjeto(cfg.riegoExterno) || !esObjeto(cfg.ventilacion)) {
      throw new BadRequestException('La configuración tiene que incluir riegoInterno, riegoExterno y ventilacion');
    }
    await this.db.query(
      'INSERT INTO Configuracion (id, datos) VALUES (1, ?) ON DUPLICATE KEY UPDATE datos = VALUES(datos)',
      [JSON.stringify(cfg)],
    );
  }
}

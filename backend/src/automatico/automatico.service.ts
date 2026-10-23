import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { ConfiguracionService } from '../configuracion/configuracion.service';
import { DB } from '../database/database.module';
import { InvernaderoService } from '../invernadero/invernadero.service';
import { riegoExterno, riegoInterno, ventilacion, type EstadoValvula } from './reglas';

// Cada cuánto se revisan las reglas del modo automático
const CADA_MS = 15_000;

type FilaValvula = RowDataPacket & {
  id: number;
  ubicacion: 'mesa' | 'cantero';
  estado: number;
  humedad: number | null;
  inicio_ciclo: Date | null;
  ultimo_fin: Date | null;
  seg_hoy: number | string;
};

// Aplica las reglas de Configuracion a los grupos que están en modo automático
@Injectable()
export class AutomaticoService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger('Automatico');
  private timer?: NodeJS.Timeout;
  private corriendo = false;

  constructor(
    @Inject(DB) private readonly db: Pool,
    private readonly invernadero: InvernaderoService,
    private readonly configuracion: ConfiguracionService,
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => void this.revisar(), CADA_MS);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  async revisar() {
    if (this.corriendo) return;
    this.corriendo = true;
    try {
      const cfg = await this.configuracion.obtener();
      if (!cfg) return;
      const estado = await this.invernadero.estado();
      const { automatico } = estado;
      if (!automatico.ventilacion && !automatico.riegoInterno && !automatico.riegoExterno) return;
      const ahora = new Date();

      if (automatico.ventilacion) {
        const [[fila]] = await this.db.query<RowDataPacket[]>('SELECT MAX(cambiado_en) AS ultimo FROM Ventilacion');
        const accion = ventilacion(
          estado.ambiente.temperatura,
          estado.ventiladores.map(v => v.encendido),
          (fila?.ultimo as Date | null) ?? null,
          cfg.ventilacion,
          ahora,
        );
        if (accion !== null) {
          await this.invernadero.setVentilador('todos', accion);
          this.log.log(`Ventiladores ${accion ? 'encendidos' : 'apagados'} (${estado.ambiente.temperatura} °C)`);
        }
      }

      if (automatico.riegoInterno || automatico.riegoExterno) {
        const valvulas = await this.valvulas(ahora);
        const mesas = valvulas.filter(v => v.ubicacion === 'mesa');
        const canteros = valvulas.filter(v => v.ubicacion === 'cantero');
        const { riegoExterno: ext } = cfg;

        const acciones = [
          ...(automatico.riegoInterno ? mesas.map((v, i) => [v.id, riegoInterno(v, i, cfg.riegoInterno, ahora)] as const) : []),
          ...(automatico.riegoExterno
            ? canteros.map((v, i) => [v.id, riegoExterno(v, ext.modo === 'individual' ? ext.canteros[i] ?? ext.global : ext.global, ahora)] as const)
            : []),
        ];
        const abrir = acciones.filter(([, a]) => a === 'abrir').map(([id]) => id);
        const cerrar = acciones.filter(([, a]) => a === 'cerrar').map(([id]) => id);
        await this.invernadero.cambiarValvulas(abrir, true, true);
        await this.invernadero.cambiarValvulas(cerrar, false, true);
        if (abrir.length) this.log.log(`Riego iniciado en las electroválvulas ${abrir.join(', ')}`);
        if (cerrar.length) this.log.log(`Riego detenido en las electroválvulas ${cerrar.join(', ')}`);
      }
    } catch (e) {
      this.log.error(`No se pudieron aplicar las reglas: ${e instanceof Error ? e.message : e}`);
    } finally {
      this.corriendo = false;
    }
  }

  // Estado de cada electroválvula con la humedad de su sensor y sus ciclos de riego
  private async valvulas(ahora: Date): Promise<(EstadoValvula & { ubicacion: 'mesa' | 'cantero' })[]> {
    const inicioDelDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const [filas] = await this.db.query<FilaValvula[]>(
      `SELECT e.id_electrovalvula AS id, e.ubicacion, e.estado, h.registro_humedad AS humedad,
              (SELECT MAX(c.inicio) FROM Ciclo_Riego c WHERE c.id_electrovalvula = e.id_electrovalvula AND c.fin IS NULL) AS inicio_ciclo,
              (SELECT MAX(c.fin) FROM Ciclo_Riego c WHERE c.id_electrovalvula = e.id_electrovalvula) AS ultimo_fin,
              (SELECT COALESCE(SUM(TIMESTAMPDIFF(SECOND, GREATEST(c.inicio, ?), COALESCE(c.fin, ?))), 0)
                 FROM Ciclo_Riego c
                WHERE c.id_electrovalvula = e.id_electrovalvula AND COALESCE(c.fin, ?) > ?) AS seg_hoy
         FROM Electrovalvula e
         LEFT JOIN Cantero_Electrovalvula ce ON ce.id_electrovalvula = e.id_electrovalvula
         LEFT JOIN Humedad_Suelo h ON h.id_cantero = ce.id_cantero
        ORDER BY e.id_electrovalvula`,
      [inicioDelDia, ahora, ahora, inicioDelDia],
    );
    return filas.map(f => ({
      id: f.id,
      ubicacion: f.ubicacion,
      encendida: !!f.estado,
      humedad: f.humedad,
      inicioCiclo: f.inicio_ciclo,
      ultimoFin: f.ultimo_fin,
      minutosHoy: Number(f.seg_hoy) / 60,
    }));
  }
}

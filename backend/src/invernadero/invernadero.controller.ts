import { BadRequestException, Body, Controller, Get, HttpCode, type MessageEvent, Param, Patch, Sse } from '@nestjs/common';
import { EMPTY, catchError, from, interval, map, merge, type Observable, startWith, switchMap } from 'rxjs';
import { InvernaderoService } from './invernadero.service';
import { GRUPOS_AUTOMATICO, type GrupoAutomatico } from './invernadero.types';

// Grupo de válvulas tal como lo nombra el panel → ubicación en la base
const UBICACION = { valvulasInternas: 'mesa', valvulasExternas: 'cantero' } as const;

// Cada cuánto se manda el estado aunque nadie lo cambie desde la API (por ejemplo, mediciones nuevas en la base)
const REENVIO_MS = 10_000;

const booleano = (v: unknown, campo: string): boolean => {
  if (typeof v !== 'boolean') throw new BadRequestException(`"${campo}" tiene que ser true o false`);
  return v;
};

const identificador = <T extends string>(v: string, todos: T): number | T => {
  if (v === todos) return todos;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1) throw new BadRequestException('Identificador inválido');
  return n;
};

@Controller('invernadero')
export class InvernaderoController {
  constructor(private readonly invernadero: InvernaderoService) {}

  @Get()
  estado() {
    return this.invernadero.estado();
  }

  // Server-Sent Events: manda el estado al conectarse, cada vez que cambia algo y cada REENVIO_MS
  @Sse('eventos')
  eventos(): Observable<MessageEvent> {
    return merge(interval(REENVIO_MS), this.invernadero.cambios).pipe(
      startWith(null),
      switchMap(() => from(this.invernadero.estado()).pipe(catchError(() => EMPTY))),
      map(data => ({ data })),
    );
  }

  @Patch('ventiladores/:id')
  @HttpCode(204)
  async ventilador(@Param('id') id: string, @Body() body: { encendido?: unknown }) {
    await this.invernadero.setVentilador(identificador(id, 'todos'), booleano(body?.encendido, 'encendido'));
  }

  // Va antes de ':grupo/:id' para que Nest no la confunda con una válvula
  @Patch('automatico/:grupo')
  @HttpCode(204)
  async automatico(@Param('grupo') grupo: string, @Body() body: { activo?: unknown }) {
    if (!GRUPOS_AUTOMATICO.includes(grupo as GrupoAutomatico)) throw new BadRequestException('Grupo inválido');
    await this.invernadero.setAutomatico(grupo as GrupoAutomatico, booleano(body?.activo, 'activo'));
  }

  @Patch(':grupo/:id')
  @HttpCode(204)
  async valvula(@Param('grupo') grupo: string, @Param('id') id: string, @Body() body: { encendida?: unknown }) {
    if (!(grupo in UBICACION)) throw new BadRequestException('Grupo de válvulas inválido');
    await this.invernadero.setValvula(
      UBICACION[grupo as keyof typeof UBICACION],
      identificador(id, 'todas'),
      booleano(body?.encendida, 'encendida'),
    );
  }
}

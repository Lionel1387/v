import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracion: ConfiguracionService) {}

  @Get()
  async obtener() {
    // Nest no manda cuerpo si devolvemos null: lo envolvemos para que el panel siempre reciba JSON
    return { configuracion: await this.configuracion.obtener() };
  }

  @Put()
  @HttpCode(204)
  async guardar(@Body() body: unknown) {
    await this.configuracion.guardar(body);
  }
}

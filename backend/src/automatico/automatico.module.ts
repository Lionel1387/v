import { Module } from '@nestjs/common';
import { ConfiguracionModule } from '../configuracion/configuracion.module';
import { InvernaderoModule } from '../invernadero/invernadero.module';
import { AutomaticoService } from './automatico.service';

@Module({
  imports: [ConfiguracionModule, InvernaderoModule],
  providers: [AutomaticoService],
})
export class AutomaticoModule {}

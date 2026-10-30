import { Module } from '@nestjs/common';
import { InvernaderoController } from './invernadero.controller';
import { InvernaderoService } from './invernadero.service';

@Module({
  controllers: [InvernaderoController],
  providers: [InvernaderoService],
  exports: [InvernaderoService],
})
export class InvernaderoModule {}

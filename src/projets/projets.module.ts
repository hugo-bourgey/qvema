import { Module } from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { ProjetsController } from './projets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projet } from './entities/projet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Projet])],

  controllers: [ProjetsController],
  providers: [ProjetsService],
})
export class ProjetsModule {}

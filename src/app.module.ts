import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestsModule } from './interests/interests.module';
import { ProjetsModule } from './projets/projets.module';
import dataSource from './config/orm.config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { InvestmentsModule } from './investments/investments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    UsersModule,
    InterestsModule,
    ProjetsModule,
    AuthModule,
    AdminModule,
    InvestmentsModule, // Ajout du module admin
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
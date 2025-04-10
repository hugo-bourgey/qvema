import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/users/users.role_enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';

@Controller('projets')
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Roles(RoleEnum.ENTREPRENEUR)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createProjetDto: CreateProjetDto) {
    return this.projetsService.create(createProjetDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.projetsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.projetsService.findOne(id);
  }

  @Roles(RoleEnum.ENTREPRENEUR)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjetDto: UpdateProjetDto) {
    return this.projetsService.update(id, updateProjetDto);
  }

  @Roles(RoleEnum.ENTREPRENEUR, RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.projetsService.remove(id, req.user.id);
  }
}

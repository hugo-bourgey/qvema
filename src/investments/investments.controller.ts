import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/users/users.role_enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projet } from '../projets/entities/projet.entity';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';

@Controller('investments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InvestmentsController {
  constructor(
    private readonly investmentsService: InvestmentsService,

    @InjectRepository(Projet)
    private readonly projetRepository: Repository<Projet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  @Roles(RoleEnum.INVESTOR)
  async create(@Body() body: { amount: number; projectId: string }, @Request() req: any) {
    const user = await this.userRepository.findOne({ where: { id: req.user.id } });
    const project = await this.projetRepository.findOne({ where: { id: body.projectId } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.investmentsService.create(body.amount, user, project);
  }

  @Get()
  @Roles(RoleEnum.INVESTOR)
  async findAll(@Request() req: any) {
    return this.investmentsService.findAllByInvestor(req.user.id);
  }

  @Get('project/:id')
  @Roles(RoleEnum.ENTREPRENEUR, RoleEnum.ADMIN)
  async findByProject(@Param('id') id: string, @Request() req: any) {
    const project = await this.projetRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    if (req.user.role === RoleEnum.ENTREPRENEUR && project.ownerId !== req.user.id) {
      throw new NotFoundException('Not your project');
    }

    return this.investmentsService.findByProject(id);
  }

  @Delete(':id')
  @Roles(RoleEnum.INVESTOR)
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.investmentsService.remove(id, req.user.id);
  }
}

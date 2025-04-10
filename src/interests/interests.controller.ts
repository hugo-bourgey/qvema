import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/users/users.role_enum';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(createInterestDto);
  }

  @Get()
  findAll() {
    return this.interestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateInterestDto: UpdateInterestDto,
  ) {
    return this.interestsService.update(id, updateInterestDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.interestsService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/decorators/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from './users.role_enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(RoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Routes pour la gestion des intérêts
  @Post(':userId/interests/:interestId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  addInterestToUser(
    @Param('userId') userId: string,
    @Param('interestId') interestId: string,
  ) {
    return this.usersService.addInterestToUser(userId, interestId);
  }

  @Delete(':userId/interests/:interestId')
  @UseGuards(AuthGuard('jwt'))
  removeInterestFromUser(
    @Param('userId') userId: string,
    @Param('interestId') interestId: string,
  ) {
    return this.usersService.removeInterestFromUser(userId, interestId);
  }

  @Get(':userId/interests')
  @UseGuards(AuthGuard('jwt'))
  getUserInterests(@Param('userId') userId: string) {
    return this.usersService.getUserInterests(userId);
  }
}
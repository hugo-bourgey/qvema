import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/decorators/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleEnum } from "src/users/users.role_enum";

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {

    @Roles(RoleEnum.ADMIN)
    @Get('dashboard')
    getAdminDashboard() {
        return { message: 'Bienvenue sur le dahsboard admin !'}
    }

    @Roles(RoleEnum.ADMIN)
    @Get('users')
    getUsers() {
        return { message: 'Liste des utilisateurs'}
    }

    @Roles(RoleEnum.ADMIN)
    @Get('projets')
    getProjets() {
        return { message: 'Liste des projets'}
    }

    @Roles(RoleEnum.ADMIN)
    @Get('interests')
    getInterests() {
        return { message: 'Liste des centres d\'intérêts'}
    }
}
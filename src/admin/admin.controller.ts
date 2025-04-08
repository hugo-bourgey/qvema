import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/decorators/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {

    @Roles('admin')
    @Get('dashboard')
    getAdminDashboard() {
        return { message: 'Bienvenue sur le dahsboard admin !'}
    }
}
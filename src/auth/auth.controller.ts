import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "src/users/entities/user.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    login(@Body() user: User) {
        return this.authService.login(user);
    }

    @Post('register')
    register(@Body() userDto: CreateUserDto) {
        return this.authService.register(userDto);
    }

    @Post('logout')
    logout(@Body('token') token: string) {
        return this.authService.logout(token);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile() {
        return {
            message: 'profile'
        };
    }
}
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/entities/user.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { BlackListService } from "./blacklist.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly blacklistService: BlackListService
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user || (await !bcrypt.compare(password, user.password))) {
          throw new UnauthorizedException('Identifiants incorrects');
        }
    
        return user;
      }

    async login(user: User) {
        const validatedUser = await this.validateUser(user.email, user.password);
        const payload = { email: validatedUser.email, sub: validatedUser.id, role: validatedUser.role };
        return { access_token: this.jwtService.sign(payload)}
    }

    async register(userDto: CreateUserDto) {
        const user = await this.usersService.create(userDto);
        const payload = { email: user.email, sub: user.id, role: user.role };
        return { access_token: this.jwtService.sign(payload)}
    }

    async logout(token: string) {
        this.blacklistService.addToken(token);
    }
}
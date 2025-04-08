import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { BlackListService } from "./blacklist.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly blacklistService: BlackListService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        });
    }

    async validate(payload: any, req?: any): Promise<any> {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Non autorisé');
        }

        if (this.blacklistService.isBlacklisted(token)) {
            throw new UnauthorizedException('Token invalide');
        }
        return await this.authService.validateUser(payload.email, payload.password);
    }
}
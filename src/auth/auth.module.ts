import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { BlackListService } from "./blacklist.service";
import { UsersModule } from "src/users/users.module";

@Global()
@Module({
    imports: [
        PassportModule,
        ConfigModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: parseInt(
                        configService.get<string>('JWT_EXPIRES_IN') ?? '3600',
                    ),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, BlackListService],
    exports: [AuthService],
})
export class AuthModule {}
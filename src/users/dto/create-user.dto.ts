import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "../users.role_enum";

export class CreateUserDto {

        @IsEmail()
        email: string;
    
        @IsString()
        password: string;
    
        @IsString()
        @IsOptional()
        firstname: string;
    
        @IsString()
        @IsOptional()
        lastname: string;
    
        @IsOptional()
        @IsEnum(RoleEnum)
        role: string;
}

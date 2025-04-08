import { IsNumber, IsString } from "class-validator";

export class CreateProjetDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    budget: number;

    @IsString()
    category: string;
}

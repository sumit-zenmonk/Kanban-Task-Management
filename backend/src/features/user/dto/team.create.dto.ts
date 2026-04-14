import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class TeamCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(3)
    description: string;
}
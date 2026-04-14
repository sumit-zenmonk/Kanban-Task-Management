import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class TeamEditDto {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}
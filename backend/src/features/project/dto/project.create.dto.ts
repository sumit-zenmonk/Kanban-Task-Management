import { IsString, IsNotEmpty, IsOptional, IsUUID, } from 'class-validator';

export class ProjectCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUUID()
    @IsNotEmpty()
    team_uuid: string;
}
import { IsString, IsNotEmpty, IsOptional, IsUUID, } from 'class-validator';

export class ProjectUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}
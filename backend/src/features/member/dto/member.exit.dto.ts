import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class MemberExitDto {
    @IsUUID()
    @IsNotEmpty()
    team_uuid: string;
}
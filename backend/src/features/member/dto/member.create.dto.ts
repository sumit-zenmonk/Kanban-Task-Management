import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { MemberRoleEnum } from 'src/domain/enums/member.role';

export class MemberCreateDto {
    @IsUUID()
    @IsNotEmpty()
    member_uuid: string;

    @IsUUID()
    @IsNotEmpty()
    team_uuid: string;

    @IsString()
    @IsOptional()
    role: MemberRoleEnum.MEMBER;
}
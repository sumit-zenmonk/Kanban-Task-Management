import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { MemberRoleEnum } from 'src/domain/enums/member.role';

export class MemberUpdateDto {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsUUID()
    @IsNotEmpty()
    team_uuid: string;

    @IsString()
    role: MemberRoleEnum.MEMBER;
}
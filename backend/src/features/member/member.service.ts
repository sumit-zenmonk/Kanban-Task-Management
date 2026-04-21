import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { UserEntity } from "src/domain/entities/user.entity";
import { MemberCreateDto } from "./dto/member.create.dto";
import { MemberRepository } from "src/infrastructure/repository/member.repo";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { MemberRoleEnum } from "src/domain/enums/member.enum";
import { MemberUpdateDto } from "./dto/member.update.dto";
import { MailService } from "src/infrastructure/mail/mail";
import { SocketService } from "src/infrastructure/socket/socket.service";
import { teamMemberAddedTemplate } from "src/infrastructure/mail/template/template";
import { MemberExitDto } from "./dto/member.exit.dto";

@Injectable()
export class MemberService {
    constructor(
        private readonly teamRepo: TeamRepository,
        private readonly memberRepo: MemberRepository,
        private readonly userRepo: UserRepository,
        private readonly mailService: MailService,
        private readonly socketService: SocketService,
    ) {
    }

    async createMember(user: UserEntity, body: MemberCreateDto) {
        //team existsance
        const isTeamExists = await this.teamRepo.getTeamByUuid(body.team_uuid);
        if (!isTeamExists) {
            throw new BadRequestException("Team not found");
        }

        // only admin can make admins
        const isAdmin = isTeamExists.members.filter((mem) => mem.member_uuid == user.uuid);
        if (isAdmin[0].role == MemberRoleEnum.MEMBER && body.role && (body.role as MemberRoleEnum) == MemberRoleEnum.ADMIN) {
            throw new BadRequestException("only admin can make admins");
        }

        // checking existsance of member in team
        const isMemberExists = await this.memberRepo.getMemberByMemberUuidAndTeamUUid(body.team_uuid, body.member_uuid);
        if (isMemberExists) {
            throw new BadRequestException("Member already exists");
        }

        const member_acc = await this.userRepo.findByUuid(body.member_uuid);

        const member = await this.memberRepo.createMember({
            ...body,
            member: member_acc || undefined,
            roleBy: user,
            onboardBy: user,
        });
        const proper_member = await this.memberRepo.getMemberByUuid(member.uuid);

        // someone added to team mail sent to user
        const emailContent = teamMemberAddedTemplate(isTeamExists.name, body.team_uuid);

        await this.mailService.sendMail({
            message: emailContent,
            subject: `You've been added to ${isTeamExists.name} team`,
            to: member_acc?.email
        });

        //send realtime-team added
        await this.socketService.emitToUser(member.member_uuid, 'member_team_joined', isTeamExists);

        return {
            data: proper_member,
            message: "Member Created Success"
        }
    }

    async getSpecificMember(uuid: string) {
        const isMemberExists = await this.memberRepo.getMemberByUuid(uuid);
        if (!isMemberExists) {
            throw new BadRequestException("Member not found");
        }

        return {
            data: isMemberExists,
            message: "Member fetched Success"
        }
    }

    async getMember(team_uuid: string, offset?: number, limit?: number) {
        offset = offset || Number(process.env.page_offset) || 0;
        limit = limit || Number(process.env.page_limit) || 10;
        const { data, total } = await this.memberRepo.getMember(team_uuid, offset, limit);

        return {
            data: data,
            totalDocuments: total,
            message: "Teams Fetched Success"
        };
    }

    async deleteMember(user: UserEntity, uuid: string) {
        // member existsance
        const isMemberExists = await this.memberRepo.getMemberByUuid(uuid);
        if (!isMemberExists) {
            throw new BadRequestException("Member not found");
        }

        //team existsance
        const isTeamExists = await this.teamRepo.getTeamByUuid(isMemberExists.team_uuid);
        if (!isTeamExists) {
            throw new BadRequestException("Team not found");
        }

        // no one can delete owner not even owner
        if (isTeamExists.creator.uuid == uuid) {
            throw new BadRequestException("owner can't be deleted");
        }
        if (isTeamExists.creator.uuid == isMemberExists.member_uuid) {
            throw new BadRequestException("owner can't be deleted");
        }

        // check if member deleting someone which is not authorised
        const isAdmin = isTeamExists.members.filter((mem) => mem.member_uuid == user.uuid);
        if (!isAdmin || !isAdmin.length) {
            throw new BadRequestException("not authorised");
        }
        if (isAdmin[0].role == MemberRoleEnum.MEMBER) {
            throw new BadRequestException("only admin can delete members");
        }

        await this.memberRepo.deleteMember(uuid);

        //send realtime-team removed
        await this.socketService.emitToUser(isMemberExists.member_uuid, 'member_removed_team', isTeamExists);

        return {
            message: "Member deleted Success"
        }
    }

    async updateTeamMember(user: UserEntity, body: MemberUpdateDto) {
        const isTeamExists = await this.teamRepo.getTeamByUuid(body.team_uuid);
        if (!isTeamExists) {
            throw new BadRequestException("Team not found");
        }

        // only admins can promote other admins
        const isAdmin = isTeamExists.members.filter((mem) => mem.member_uuid == user.uuid);
        if (isAdmin[0].role == MemberRoleEnum.MEMBER && body.role && (body.role as MemberRoleEnum) == MemberRoleEnum.ADMIN) {
            throw new BadRequestException("only admin can promote admins");
        }

        // own role can chnaged
        if (isAdmin[0].uuid == body.uuid) {
            throw new BadRequestException("Self Role can't be changed");
        }

        const creator = isTeamExists.members.filter((mem) => mem.member_uuid == isTeamExists.creator.uuid);
        // ownernship can't be changed
        if (
            creator[0].uuid === body.uuid &&
            body.role &&
            (body.role as MemberRoleEnum) !== MemberRoleEnum.ADMIN
        ) {
            throw new BadRequestException("Owner role cannot be changed");
        }

        await this.memberRepo.updateMember({ ...body, roleBy: user });

        return {
            message: "Member updated Success"
        }
    }

    async exitTeam(user: UserEntity, body: MemberExitDto) {
        const isMemberExists = await this.memberRepo.getMemberByMemberUuidAndTeamUUid(body.team_uuid, user.uuid);
        if (!isMemberExists) {
            throw new BadRequestException("Member not found");
        }

        await this.memberRepo.exitTeam(isMemberExists.uuid);

        return {
            message: "Team Exit Success"
        };
    }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { UserEntity } from "src/domain/entities/user.entity";
import { MemberCreateDto } from "./dto/member.create.dto";
import { MemberRepository } from "src/infrastructure/repository/member.repo";
import { UserRepository } from "src/infrastructure/repository/user.repo";

@Injectable()
export class MemberService {
    constructor(
        private readonly teamRepo: TeamRepository,
        private readonly memberRepo: MemberRepository,
        private readonly userRepo: UserRepository,
    ) {
    }

    async createMember(user: UserEntity, body: MemberCreateDto) {
        const isTeamExists = await this.teamRepo.getTeamByUuid(body.team_uuid);
        if (!isTeamExists) {
            throw new BadRequestException("Team not found");
        }

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

    async deleteMember(uuid: string) {
        const isMemberExists = await this.memberRepo.getMemberByUuid(uuid);
        if (!isMemberExists) {
            throw new BadRequestException("Member not found");
        }

        await this.memberRepo.deleteMember(uuid);

        return {
            message: "Member deleted Success"
        }
    }

}

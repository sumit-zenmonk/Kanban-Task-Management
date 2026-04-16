import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamCreateDto } from "./dto/team.create.dto";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { UserEntity } from "src/domain/entities/user.entity";
import { TeamEditDto } from "./dto/team.edit.dto";
import { MemberRepository } from "src/infrastructure/repository/member.repo";
import { MemberRoleEnum } from "src/domain/enums/member.enum";

@Injectable()
export class TeamService {
    constructor(
        private readonly teamRepo: TeamRepository,
        private readonly memberRepo: MemberRepository,
    ) {
    }

    async createTeam(user: UserEntity, body: TeamCreateDto) {
        const team = await this.teamRepo.createTeam({
            ...body,
            creator: user,
        });
        const proper_team = await this.teamRepo.getTeamByUuid(team.uuid);

        await this.memberRepo.createMember({
            team_uuid: team.uuid,
            member_uuid: user?.uuid,
            role: MemberRoleEnum.ADMIN,
            roleBy: user,
            onboardBy: user
        });

        return {
            data: proper_team,
            message: "Team Created Success"
        }
    }

    async editTeam(body: TeamEditDto) {
        const isTeamExists = await this.teamRepo.getTeamByUuid(body.uuid);

        if (!isTeamExists) {
            throw new BadRequestException("Team not found");
        }

        await this.teamRepo.editTeam(body);
        return {
            message: "Team updated Success"
        }
    }

    async getTeam(user: UserEntity, offset?: number, limit?: number) {
        offset = offset || Number(process.env.page_offset) || 0;
        limit = limit || Number(process.env.page_limit) || 10;
        const { data, total } = await this.teamRepo.getTeam(user.uuid, offset, limit);

        return {
            data: data,
            totalDocuments: total,
            message: "Teams Fetched Success"
        };
    }

    async getSpecificTeam(uuid: string) {
        const team = await this.teamRepo.getTeamByUuid(uuid);

        if (!team) {
            throw new BadRequestException("Team not found");
        }

        return {
            data: team,
            message: "Team fetched Success"
        }
    }

    async deleteTeam(user: UserEntity, uuid: string) {
        const team = await this.teamRepo.getTeamByUuid(uuid);

        if (!team) {
            throw new BadRequestException("Team not found");
        }

        if (team.creator.uuid !== user.uuid) {
            throw new BadRequestException("Only Owner can delete Team");
        }

        await this.teamRepo.deleteTeam(uuid);

        return {
            message: "Team deleted Success"
        }
    }
}

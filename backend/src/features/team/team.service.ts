import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamCreateDto } from "./dto/team.create.dto";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { UserEntity } from "src/domain/entities/user.entity";

@Injectable()
export class TeamService {
    constructor(
        private readonly teamRepo: TeamRepository
    ) {
    }

    async createTeam(user: UserEntity, body: TeamCreateDto) {
        const team = await this.teamRepo.createTeam({
            ...body,
            creator: user,
        });
        const proper_team = await this.teamRepo.getTeamByUuid(team.uuid);

        return {
            data: proper_team,
            message: "Team Created Success"
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

    async deleteTeam(uuid: string) {
        const team = await this.teamRepo.getTeamByUuid(uuid);

        if (!team) {
            throw new BadRequestException("Team not found");
        }

        await this.teamRepo.deleteTeam(uuid);

        return {
            message: "Team deleted Success"
        }
    }
}

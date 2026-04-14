import { Injectable } from "@nestjs/common";
import { TeamEntity } from "src/domain/entities/team.entity";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class TeamRepository extends Repository<TeamEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(TeamEntity, dataSource.createEntityManager());
    }

    async createTeam(body: Partial<TeamEntity>) {
        const team = this.create(body);
        return await this.save(team);
    }

    async getTeamByUuid(uuid: string) {
        return await this.findOne(
            {
                where: {
                    uuid: uuid
                },
                relations: {
                    creator: true
                }
            }
        );
    }

    async getTeam(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                creator: {
                    uuid: user_uuid
                }
            },
            relations: {
                creator: true
            },
            order: {
                created_at: "DESC",
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10,
        });

        return { data, total };
    }

    async deleteTeam(uuid: string) {
        return await this.softDelete(uuid);
    }
}
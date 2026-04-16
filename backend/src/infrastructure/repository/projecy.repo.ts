import { Injectable } from "@nestjs/common";
import { ProjectEntity } from "src/domain/entities/project.entity";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ProjectEntity, dataSource.createEntityManager());
    }

    async createProject(body: Partial<ProjectEntity>) {
        const project = this.create(body);
        return await this.save(project);
    }

    async getProject(team_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                team_uuid
            },
            relations: {
                team: {
                    creator: true
                },
                creator: true
            },
            select: {
                team: {
                    uuid: true,
                    name: true,
                    description: true,
                    creator: true
                },
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

    async getProjectByUuid(uuid: string) {
        return await this.findOne(
            {
                where: {
                    uuid: uuid
                },
                relations: {
                    team: {
                        creator: true
                    },
                    creator: true
                },
                select: {
                    team: {
                        uuid: true,
                        name: true,
                        description: true,
                        creator: true
                    },
                    creator: true
                },
            }
        );
    }

    async deleteProject(uuid: string) {
        return await this.softDelete(uuid);
    }

    async updateProject(body: Partial<ProjectEntity>) {
        return await this.update(
            {
                uuid: body.uuid
            },
            {
                ...body
            }
        );
    }
}
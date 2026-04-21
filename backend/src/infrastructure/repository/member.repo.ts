import { Injectable } from "@nestjs/common";
import { MemberEntity } from "src/domain/entities/members.entity";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class MemberRepository extends Repository<MemberEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(MemberEntity, dataSource.createEntityManager());
    }

    async createMember(body: Partial<MemberEntity>) {
        const member = this.create(body);
        return await this.save(member);
    }

    async getMemberByUuid(uuid: string) {
        return await this.findOne(
            {
                where: {
                    uuid: uuid
                },
                relations: {
                    roleBy: true,
                    onboardBy: true,
                    team: true,
                    member: true,
                }
            }
        );
    }

    async getMemberByMemberUuid(uuid: string) {
        return await this.findOne(
            {
                where: {
                    member_uuid: uuid
                },
                relations: {
                    roleBy: true,
                    onboardBy: true,
                    team: true,
                    member: true,
                }
            }
        );
    }

    async getMemberByMemberUuidAndTeamUUid(team_uuid: string, uuid: string) {
        return await this.findOne(
            {
                where: {
                    team_uuid: team_uuid,
                    member_uuid: uuid
                },
                relations: {
                    roleBy: true,
                    onboardBy: true,
                    team: true,
                    member: true,
                }
            }
        );
    }

    async getMember(team_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                team_uuid
            },
            relations: {
                roleBy: true,
                onboardBy: true,
                team: true,
                member: true,
            },
            order: {
                created_at: "DESC",
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10,
        });

        return { data, total };
    }

    async deleteMember(uuid: string) {
        return await this.softDelete(uuid);
    }

    async updateMember(body: Partial<MemberEntity>) {
        return await this.update(
            {
                uuid: body.uuid
            },
            {
                ...body
            }
        );
    }

    async exitTeam(uuid: string) {
        return await this.softDelete(uuid);
    }
}
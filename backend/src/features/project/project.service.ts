import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { UserEntity } from "src/domain/entities/user.entity";
import { ProjectCreateDto } from "./dto/project.create.dto";
import { ProjectRepository } from "src/infrastructure/repository/project.repo";
import { ProjectUpdateDto } from "./dto/project.update.dto";

@Injectable()
export class ProjectService {
    constructor(
        private readonly teamRepo: TeamRepository,
        private readonly projectRepo: ProjectRepository,
    ) {
    }

    async createProject(user: UserEntity, body: ProjectCreateDto) {
        //team existsance
        const isTeamExists = await this.teamRepo.getTeamByUuid(body.team_uuid);
        if (!isTeamExists) {
            throw new BadRequestException("Team not found");
        }

        //valid team member
        const isMember = isTeamExists.members.filter((mem) => mem.member_uuid == user.uuid);
        if (!isMember) {
            throw new BadRequestException("member not recognised");
        }

        const isSameProjectNameExists = await this.projectRepo.getProjectByNameAndTeamUUID(body.name, isTeamExists.uuid);
        if (isSameProjectNameExists) {
            throw new BadRequestException("Project With Same Name Exists");
        }

        const project = await this.projectRepo.createProject({ ...body, creator_uuid: user.uuid });
        const proper_project = await this.projectRepo.getProjectByUuid(project.uuid);

        return {
            data: proper_project,
            message: "Project Created Success"
        }
    }

    async getSpecificProject(uuid: string) {
        const isProjectExists = await this.projectRepo.getProjectByUuid(uuid);
        if (!isProjectExists) {
            throw new BadRequestException("Project not found");
        }

        return {
            data: isProjectExists,
            message: "Project fetched Success"
        }
    }

    async getProject(team_uuid: string, offset?: number, limit?: number) {
        offset = offset || Number(process.env.page_offset) || 0;
        limit = limit || Number(process.env.page_limit) || 10;
        const { data, total } = await this.projectRepo.getProject(team_uuid, offset, limit);

        return {
            data: data,
            totalDocuments: total,
            message: "Projects Fetched Success"
        };
    }

    async deleteProject(user: UserEntity, uuid: string) {
        //project existsance
        const isProjectExists = await this.projectRepo.getProjectByUuid(uuid);
        if (!isProjectExists) {
            throw new BadRequestException("Project not found");
        }

        if (isProjectExists.team.creator.uuid != user.uuid) {
            throw new BadRequestException("Only Admin can delete Project");
        }

        await this.projectRepo.deleteProject(uuid);

        return {
            message: "Project Deleted Success"
        };
    }

    async updateProject(user: UserEntity, body: ProjectUpdateDto) {
        //project existsance
        const isProjectExists = await this.projectRepo.getProjectByUuid(body.uuid);
        if (!isProjectExists) {
            throw new BadRequestException("Project not found");
        }

        if (isProjectExists.team.creator.uuid != user.uuid) {
            throw new BadRequestException("Only Admin can edit Project");
        }

        await this.projectRepo.updateProject(body);
        return {
            message: "Project updated Success"
        }
    }
}

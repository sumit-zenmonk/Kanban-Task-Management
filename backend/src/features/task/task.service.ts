import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { UserEntity } from "src/domain/entities/user.entity";
import { ProjectRepository } from "src/infrastructure/repository/project.repo";
import { TaskRepository } from "src/infrastructure/repository/task.repo";
import { TaskCreateDto } from "./dto/task.create.dto";
import { TaskUpdateDto } from "./dto/task.update.dto";
import { MailTrapService } from "src/infrastructure/mailtrap/mailtrap";
import { taskAssignmentTemplate } from "src/infrastructure/mailtrap/template/template";

@Injectable()
export class TaskService {
    constructor(
        private readonly teamRepo: TeamRepository,
        private readonly projectRepo: ProjectRepository,
        private readonly taskRepo: TaskRepository,
        private readonly mailTrapService: MailTrapService,
    ) {
    }

    async createTask(user: UserEntity, body: TaskCreateDto) {
        const project = await this.projectRepo.getProjectByUuid(body.project_uuid);
        if (!project) {
            throw new BadRequestException("Project not found");
        }

        const isExistWithName = await this.taskRepo.getTask(body.name, body.project_uuid);
        if (isExistWithName) {
            throw new BadRequestException("Already Active Task With this Name");
        }

        await this.taskRepo.createTask({ ...body, assigned_by_uuid: user.uuid, creator_uuid: user.uuid });

        if (body.assigned_to_uuid) {
            const member = project.team.members.filter((mem) => mem.member_uuid == body.assigned_to_uuid);

            // someone assigned task
            const emailContent = taskAssignmentTemplate(body.name, body.project_uuid, project.team_uuid);

            await this.mailTrapService.sendMail({
                message: emailContent,
                subject: `Task Assigned: ${body.name}`,
                to: member[0].member.email
            });
        }

        return {
            message: "Task Created Success"
        }
    }

    async deleteTask(user: UserEntity, uuid: string) {
        await this.taskRepo.deleteTask(uuid);

        return {
            message: "Task Deleted Success"
        };
    }

    async updateTask(user: UserEntity, body: TaskUpdateDto) {
        await this.taskRepo.updateTask({ ...body, assigned_by_uuid: user.uuid, creator_uuid: user.uuid });

        return {
            message: "task updated Success"
        }
    }
}

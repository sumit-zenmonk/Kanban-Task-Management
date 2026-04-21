import { Module } from "@nestjs/common";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { ProjectRepository } from "src/infrastructure/repository/project.repo";
import { TaskRepository } from "src/infrastructure/repository/task.repo";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { MailService } from "src/infrastructure/mail/mail";

@Module({
    imports: [],
    controllers: [TaskController],
    providers: [TaskService, TeamRepository, ProjectRepository, TaskRepository, MailService],
    exports: [TaskModule],
})

export class TaskModule { }
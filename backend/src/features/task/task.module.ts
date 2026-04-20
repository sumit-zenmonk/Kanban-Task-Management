import { Module } from "@nestjs/common";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { ProjectRepository } from "src/infrastructure/repository/project.repo";
import { TaskRepository } from "src/infrastructure/repository/task.repo";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { MailTrapService } from "src/infrastructure/mailtrap/mailtrap";

@Module({
    imports: [],
    controllers: [TaskController],
    providers: [TaskService, TeamRepository, ProjectRepository, TaskRepository, MailTrapService],
    exports: [TaskModule],
})

export class TaskModule { }
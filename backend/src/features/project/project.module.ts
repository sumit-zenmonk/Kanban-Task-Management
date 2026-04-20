import { Module } from "@nestjs/common";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectRepository } from "src/infrastructure/repository/project.repo";

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [ProjectService, TeamRepository, ProjectRepository],
    exports: [ProjectModule],
})

export class ProjectModule { }
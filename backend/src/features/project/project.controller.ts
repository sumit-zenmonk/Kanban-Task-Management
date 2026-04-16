import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { ProjectService } from "./project.service";
import { ProjectCreateDto } from "./dto/project.create.dto";
import { ProjectUpdateDto } from "./dto/project.update.dto";

@Controller('/project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    async createProject(@Req() req: Request, @Body() body: ProjectCreateDto) {
        return this.projectService.createProject(req.user, body);
    }

    @Get('/:uuid')
    async getSpecificProject(@Param('uuid') uuid: string) {
        return await this.projectService.getSpecificProject(uuid);
    }

    @Get()
    async getProject(@Query('team_uuid') team_uuid: string, @Query("offset") offset?: number, @Query("limit") limit?: number) {
        if (!team_uuid) {
            throw new BadRequestException("Team UUID missing");
        }
        return await this.projectService.getProject(team_uuid, Number(offset), Number(limit));
    }

    @Delete('/:uuid')
    async deleteMember(@Req() req: Request, @Param('uuid') uuid: string) {
        return await this.projectService.deleteProject(req.user, uuid);
    }

    @Patch()
    async updateProject(@Req() req: Request, @Body() body: ProjectUpdateDto) {
        return this.projectService.updateProject(req.user, body);
    }
}
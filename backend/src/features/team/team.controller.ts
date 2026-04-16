import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamCreateDto } from "./dto/team.create.dto";
import type { Request } from "express";
import { TeamEditDto } from "./dto/team.edit.dto";

@Controller('/team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @Post()
    async createTeam(@Req() req: Request, @Body() body: TeamCreateDto) {
        return this.teamService.createTeam(req.user, body);
    }

    @Get()
    async getTeam(@Req() req: Request, @Query("offset") offset?: number, @Query("limit") limit?: number) {
        return await this.teamService.getTeam(req.user, Number(offset), Number(limit));
    }

    @Get('/:Uuid')
    async getSpecificTeam(@Param('Uuid') uuid: string) {
        return await this.teamService.getSpecificTeam(uuid);
    }

    @Delete('/:Uuid')
    async deleteTeam(@Req() req: Request, @Param('Uuid') uuid: string) {
        return await this.teamService.deleteTeam(req.user,uuid);
    }

    @Patch()
    async editTeam(@Body() body: TeamEditDto) {
        return this.teamService.editTeam(body);
    }
}
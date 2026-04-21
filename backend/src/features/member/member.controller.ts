import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { MemberCreateDto } from "./dto/member.create.dto";
import { MemberService } from "./member.service";
import { MemberUpdateDto } from "./dto/member.update.dto";
import { MemberExitDto } from "./dto/member.exit.dto";

@Controller('/member')
export class MemberController {
    constructor(private readonly memberService: MemberService) { }

    @Post()
    async createTeam(@Req() req: Request, @Body() body: MemberCreateDto) {
        return this.memberService.createMember(req.user, body);
    }

    @Post('/exit')
    async exitTeam(@Req() req: Request, @Body() body: MemberExitDto) {
        return await this.memberService.exitTeam(req.user, body);
    }

    @Get('/:uuid')
    async getSpecificMember(@Param('uuid') uuid: string) {
        return await this.memberService.getSpecificMember(uuid);
    }

    @Get()
    async getTeam(@Param('team_uuid') team_uuid: string, @Query("offset") offset?: number, @Query("limit") limit?: number) {
        return await this.memberService.getMember(team_uuid, Number(offset), Number(limit));
    }

    @Delete('/:uuid')
    async deleteMember(@Req() req: Request, @Param('uuid') uuid: string) {
        return await this.memberService.deleteMember(req.user, uuid);
    }

    @Patch()
    async updateTeamMember(@Req() req: Request, @Body() body: MemberUpdateDto) {
        return await this.memberService.updateTeamMember(req.user, body);
    }
}
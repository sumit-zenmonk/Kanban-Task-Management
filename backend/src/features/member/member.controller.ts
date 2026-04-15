import { Body, Controller, Delete, Get, Param, Post, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { MemberCreateDto } from "./dto/member.create.dto";
import { MemberService } from "./member.service";

@Controller('/member')
export class MemberController {
    constructor(private readonly memberService: MemberService) { }

    @Post()
    async createTeam(@Req() req: Request, @Body() body: MemberCreateDto) {
        return this.memberService.createMember(req.user, body);
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
    async deleteMember(@Param('uuid') uuid: string) {
        return await this.memberService.deleteMember(uuid);
    }

}
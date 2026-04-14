import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { UserService } from "./user.service";

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getUser(@Req() req: Request, @Query("offset") offset?: number, @Query("limit") limit?: number) {
        return await this.userService.getUser(req.user, Number(offset), Number(limit));
    }

    @Get('/:Uuid')
    async getSpecificUser(@Param('Uuid') uuid: string) {
        return await this.userService.getSpecificUser(uuid);
    }
}
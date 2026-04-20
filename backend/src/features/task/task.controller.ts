import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { TaskCreateDto } from "./dto/task.create.dto";
import { TaskService } from "./task.service";
import { TaskUpdateDto } from "./dto/task.update.dto";

@Controller('/task')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    async createProject(@Req() req: Request, @Body() body: TaskCreateDto) {
        return this.taskService.createTask(req.user, body);
    }

    @Delete('/:uuid')
    async deleteMember(@Req() req: Request, @Param('uuid') uuid: string) {
        return await this.taskService.deleteTask(req.user, uuid);
    }

    @Patch()
    async updateProject(@Req() req: Request, @Body() body: TaskUpdateDto) {
        return this.taskService.updateTask(req.user, body);
    }
}
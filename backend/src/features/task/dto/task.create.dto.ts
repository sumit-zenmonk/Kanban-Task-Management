import { IsString, IsNotEmpty, IsOptional, IsUUID, } from 'class-validator';
import { TaskStatusEnum } from 'src/domain/enums/task.enum';

export class TaskCreateDto {
    @IsUUID()
    @IsNotEmpty()
    project_uuid: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUUID()
    @IsOptional()
    assigned_to_uuid: string;

    @IsString()
    @IsOptional()
    status: TaskStatusEnum.TODO;
}
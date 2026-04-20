import { IsString, IsNotEmpty, IsOptional, IsUUID, } from 'class-validator';
import { TaskStatusEnum } from 'src/domain/enums/task.enum';

export class TaskUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsUUID()
    @IsOptional()
    assigned_to_uuid: string;

    @IsString()
    @IsOptional()
    status: TaskStatusEnum.TODO;
}
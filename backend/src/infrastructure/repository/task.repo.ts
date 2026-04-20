import { Injectable } from "@nestjs/common";
import { TaskEntity } from "src/domain/entities/task.entity";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(TaskEntity, dataSource.createEntityManager());
    }

    async createTask(body: Partial<TaskEntity>) {
        const task = this.create(body);
        return await this.save(task);
    }

    async getTask(name: string, project_uuid: string) {
        return await this.findOne({
            where: {
                name,
                project_uuid
            }
        });
    }

    async deleteTask(uuid: string) {
        return await this.softDelete(uuid);
    }

    async updateTask(body: Partial<TaskEntity>) {
        return await this.update(
            {
                uuid: body.uuid
            },
            {
                ...body
            }
        );
    }
}
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStatusEnum } from "../enums/task.enum";

@Entity('task')
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    creator_uuid: string

    @Column()
    assigned_by_uuid: string

    @Column()
    assigned_to_uuid: string

    @Column({
        type: "enum",
        enum: TaskStatusEnum,
        default: TaskStatusEnum.TODO,
    })
    status: TaskStatusEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
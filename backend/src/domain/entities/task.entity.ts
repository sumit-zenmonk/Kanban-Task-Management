import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStatusEnum } from "../enums/task.enum";
import { UserEntity } from "./user.entity";
import { TeamEntity } from "./team.entity";
import { ProjectEntity } from "./project.entity";

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
    project_uuid: string

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

    @ManyToOne(() => UserEntity, (user) => user.task_created)
    @JoinColumn({ name: "creator_uuid" })
    creator: UserEntity

    @ManyToOne(() => ProjectEntity, (project) => project.tasks)
    @JoinColumn({ name: "project_uuid" })
    project: ProjectEntity

    @ManyToOne(() => UserEntity, (user) => user.task_assigned_by_me)
    @JoinColumn({ name: "assigned_by_uuid" })
    assigned_by_user: UserEntity

    @ManyToOne(() => UserEntity, (user) => user.task_assigned_to)
    @JoinColumn({ name: "assigned_to_uuid" })
    assigned_to_user: UserEntity

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
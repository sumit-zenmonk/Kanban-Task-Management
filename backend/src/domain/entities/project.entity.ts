import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TeamEntity } from "./team.entity";
import { UserEntity } from "./user.entity";
import { TaskEntity } from "./task.entity";

@Entity('project')
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    team_uuid: string

    @Column()
    creator_uuid: string

    @ManyToOne(() => TeamEntity, (team) => team.projects)
    @JoinColumn({ name: "team_uuid" })
    team: TeamEntity

    @ManyToOne(() => UserEntity, (user) => user.projects)
    @JoinColumn({ name: "creator_uuid" })
    creator: UserEntity;

    @OneToMany(() => TaskEntity, (task) => task.project)
    tasks: TaskEntity[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
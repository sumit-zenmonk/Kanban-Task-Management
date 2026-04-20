import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TeamEntity } from "./team.entity";
import { MemberEntity } from "./members.entity";
import { ProjectEntity } from "./project.entity";
import { TaskEntity } from "./task.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    image: string

    @OneToMany(() => TeamEntity, (team) => team.creator)
    teams: TeamEntity[]

    @OneToMany(() => MemberEntity, (member) => member.member)
    memberships: MemberEntity[];

    @OneToMany(() => MemberEntity, (member) => member.roleBy)
    rolesAssigned: MemberEntity[];

    @OneToMany(() => MemberEntity, (member) => member.onboardBy)
    onboardedMembers: MemberEntity[];

    @OneToMany(() => ProjectEntity, (project) => project.creator)
    projects: ProjectEntity[]

    @OneToMany(() => TaskEntity, (task) => task.assigned_by_user)
    task_assigned_by_me: TaskEntity[]

    @OneToMany(() => TaskEntity, (task) => task.creator)
    task_created: TaskEntity[]

    @OneToMany(() => TaskEntity, (task) => task.assigned_to_user)
    task_assigned_to: TaskEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
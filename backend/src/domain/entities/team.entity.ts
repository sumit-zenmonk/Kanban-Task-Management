import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { MemberEntity } from "./members.entity";
import { ProjectEntity } from "./project.entity";

@Entity('team')
export class TeamEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => UserEntity, (user) => user.teams)
    @JoinColumn({ name: "creator_uuid" })
    creator: UserEntity;

    @OneToMany(() => MemberEntity, (member) => member.team)
    members: MemberEntity[];

    @OneToMany(() => ProjectEntity, (project) => project.team)
    projects: ProjectEntity[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
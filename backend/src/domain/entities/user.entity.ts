import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TeamEntity } from "./team.entity";
import { MemberEntity } from "./members.entity";

@Entity('users')
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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
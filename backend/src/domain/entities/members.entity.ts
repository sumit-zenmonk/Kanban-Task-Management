import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { UserEntity } from "./user.entity";
import { TeamEntity } from "./team.entity";
import { MemberRoleEnum } from "../enums/member.role";

@Entity("member")
export class MemberEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    member_uuid: string

    @Column()
    team_uuid: string

    @Column({
        type: "enum",
        enum: MemberRoleEnum,
        default: MemberRoleEnum.MEMBER,
    })
    role: MemberRoleEnum;

    @ManyToOne(() => UserEntity, (user) => user.memberships)
    @JoinColumn({ name: "member_uuid" })
    member: UserEntity;

    @ManyToOne(() => TeamEntity, (team) => team.members)
    @JoinColumn({ name: "team_uuid" })
    team: TeamEntity;

    @ManyToOne(() => UserEntity, (user) => user.rolesAssigned)
    @JoinColumn({ name: "role_by" })
    roleBy: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.onboardedMembers)
    @JoinColumn({ name: "onboard_by" })
    onboardBy: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
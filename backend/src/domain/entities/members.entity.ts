import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { UserEntity } from "./user.entity";
import { TeamEntity } from "./team.entity";
import { MemberRoleEnum } from "../enums/member.role";

@Entity("member")
export class MemberEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "member_uuid" })
    member: UserEntity;

    @ManyToOne(() => TeamEntity)
    @JoinColumn({ name: "team_uuid" })
    team: TeamEntity;

    @Column({
        type: "enum",
        enum: MemberRoleEnum,
        default: MemberRoleEnum.MEMBER,
    })
    role: MemberRoleEnum;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "role_by" })
    roleBy: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "onboard_by" })
    onboardBy: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { MemberRepository } from "src/infrastructure/repository/member.repo";

@Module({
    imports: [],
    controllers: [MemberController],
    providers: [UserRepository, MemberService, TeamRepository, MemberRepository],
    exports: [MemberModule],
})

export class MemberModule { }
import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { JwtHelperService } from "src/infrastructure/services/jwtservice";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { MemberRepository } from "src/infrastructure/repository/member.repo";

@Module({
    imports: [],
    controllers: [TeamController],
    providers: [JwtHelperService, UserRepository, TeamService, TeamRepository, MemberRepository],
    exports: [TeamModule],
})

export class TeamModule { }
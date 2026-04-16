import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { TeamRepository } from "src/infrastructure/repository/team.repo";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { MemberRepository } from "src/infrastructure/repository/member.repo";
import { MailTrapService } from "src/infrastructure/mailtrap/mailtrap";
import { SocketModule } from "src/infrastructure/socket/socket.module";

@Module({
    imports: [],
    controllers: [MemberController],
    providers: [UserRepository, MemberService, TeamRepository, MemberRepository, MailTrapService, SocketModule],
    exports: [MemberModule],
})

export class MemberModule { }
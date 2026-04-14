import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { AuthController } from "./auth.controller";
import { JwtHelperService } from "src/infrastructure/services/jwtservice";
import { MailTrapService } from "src/infrastructure/mailtrap/mailtrap";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [JwtHelperService, UserRepository, AuthService, MailTrapService],
    exports: [AuthModule],
})

export class AuthModule { }
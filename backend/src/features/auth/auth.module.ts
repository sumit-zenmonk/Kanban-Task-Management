import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { AuthController } from "./auth.controller";
import { JwtHelperService } from "src/infrastructure/services/jwtservice";
import { MailService } from "src/infrastructure/mail/mail";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [JwtHelperService, UserRepository, AuthService, MailService],
    exports: [AuthModule],
})

export class AuthModule { }
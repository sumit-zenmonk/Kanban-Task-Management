import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { JwtHelperService } from "src/infrastructure/services/jwtservice";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [JwtHelperService, UserRepository, UserService, UserRepository],
    exports: [UserModule],
})

export class UserModule { }
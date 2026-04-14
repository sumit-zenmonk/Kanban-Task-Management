import { Global, Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { JwtHelperService } from "../services/jwtservice";
import { UserRepository } from "../repository/user.repo";

@Global()
@Module({
    providers: [SocketService, JwtHelperService, UserRepository],
    exports: [SocketService],
})
export class SocketModule { }

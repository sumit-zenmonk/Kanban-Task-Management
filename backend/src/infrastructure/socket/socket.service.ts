import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtHelperService } from 'src/infrastructure/services/jwtservice';
import { UserRepository } from 'src/infrastructure/repository/user.repo';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private activeUsers = new Map<string, string>();
    // user_uuid -> socket_id

    constructor(
        private readonly jwtService: JwtHelperService,
        private readonly userRepo: UserRepository,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization;
            if (!token) {
                client.disconnect();
                return;
            }

            const decoded = await this.jwtService.verifyJwtToken(token);
            const user = await this.userRepo.findByUuid(decoded.uuid);

            if (!user) {
                client.disconnect();
                return;
            }

            this.activeUsers.set(decoded.uuid, client.id);
            console.log(`User connected: ${decoded.uuid}`);
        } catch (e) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        for (const [uuid, socketId] of this.activeUsers.entries()) {
            if (socketId === client.id) {
                this.activeUsers.delete(uuid);
                console.log(`User disconnected: ${uuid}`);
                break;
            }
        }
    }

    // send msg to receiver only
    async emitToUser(userUuid: string, event: string, data: any) {
        const socketId = this.activeUsers.get(userUuid);
        if (socketId) {
            this.server.to(socketId).emit(event, data);
        }
    }

    @SubscribeMessage('project_connect')
    handleProjectConnection(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket
    ) {
        client.join(data.project_uuid);
    }

    @SubscribeMessage('task_move')
    handleTaskMove(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket
    ) {
        const { project_uuid } = data;
        client.to(project_uuid).emit('task_move', data);
    }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user.entity";
import { UserRepository } from "src/infrastructure/repository/user.repo";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository
    ) {
    }

    async getUser(user: UserEntity, offset?: number, limit?: number) {
        offset = offset || Number(process.env.page_offset) || 0;
        limit = limit || Number(process.env.page_limit) || 10;
        const { data, total } = await this.userRepo.getUsers(user.uuid, offset, limit);

        return {
            data: data,
            totalDocuments: total,
            message: "Users Fetched Success"
        };
    }

    async getSpecificUser(uuid: string) {
        const user = await this.userRepo.findByUuid(uuid);

        if (!user) {
            throw new BadRequestException("User not found");
        }

        return {
            data: user,
            message: "User fetched Success"
        }
    }
}

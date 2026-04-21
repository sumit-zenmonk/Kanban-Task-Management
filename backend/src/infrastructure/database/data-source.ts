//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { UserEntity } from "src/domain/entities/user.entity";
import { TeamEntity } from "src/domain/entities/team.entity";
import { MemberEntity } from "src/domain/entities/members.entity";
import { ProjectEntity } from "src/domain/entities/project.entity";
import { TaskEntity } from "src/domain/entities/task.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, TeamEntity, MemberEntity, ProjectEntity, TaskEntity
    ],
    synchronize: false,
    migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT,
    },
};

const dataSource = new DataSource(options);

export { dataSource, options };
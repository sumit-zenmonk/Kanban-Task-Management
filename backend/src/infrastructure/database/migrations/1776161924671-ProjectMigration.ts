import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ProjectMigration1776161924670 implements MigrationInterface {
    name: "ProjectMigration1776161924670"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "project",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "name", type: "varchar" },
                    { name: "description", type: "varchar" },
                    { name: "team_uuid", type: "uuid" },
                    { name: "creator_uuid", type: "uuid" },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true }
                ]
            })
        );

        await queryRunner.createForeignKeys("project", [
            new TableForeignKey({
                name: "FK_PROJECT_TEAM",
                columnNames: ["team_uuid"],
                referencedTableName: "team",
                referencedColumnNames: ["uuid"]
            }),
            new TableForeignKey({
                name: "FK_PROJECT_USER",
                columnNames: ["creator_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"]
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("project", "FK_PROJECT_TEAM");
        await queryRunner.dropForeignKey("project", "FK_PROJECT_USER");
        await queryRunner.dropTable("project");
    }
}

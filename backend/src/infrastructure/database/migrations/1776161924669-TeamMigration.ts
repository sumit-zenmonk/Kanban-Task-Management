import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class TeamMigration1776161924669 implements MigrationInterface {
    name: "TeamMigration1776161924669"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "team",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "name", type: "varchar" },
                    { name: "description", type: "varchar" },
                    { name: "creator_uuid", type: "uuid" },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "team",
            new TableForeignKey({
                name: "FK_TEAM_USER",
                columnNames: ["creator_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("team", "FK_TEAM_USER");
        await queryRunner.dropTable("team");
    }
}

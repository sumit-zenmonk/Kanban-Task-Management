import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class TaskMigration1776161924672 implements MigrationInterface {
    name: "TaskMigration1776161924672"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."status_enum" AS ENUM('todo', 'doing','standby','done')`
        );

        await queryRunner.createTable(
            new Table({
                name: "task",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "name", type: "varchar" },
                    { name: "description", type: "varchar" },
                    { name: "status", type: "status_enum", default: "'todo'" },
                    { name: "creator_uuid", type: "uuid" },
                    { name: "project_uuid", type: "uuid" },
                    { name: "assigned_by_uuid", type: "uuid", isNullable: true },
                    { name: "assigned_to_uuid", type: "uuid", isNullable: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true }
                ]
            })
        );

        await queryRunner.createForeignKeys("task", [
            new TableForeignKey({
                name: "FK_TASK_CREATOR",
                columnNames: ["creator_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"]
            }),
            new TableForeignKey({
                name: "FK_TASK_PROJECT",
                columnNames: ["project_uuid"],
                referencedTableName: "project",
                referencedColumnNames: ["uuid"]
            }),
            new TableForeignKey({
                name: "FK_TASK_ASSIGNED_BY",
                columnNames: ["assigned_by_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"]
            }),
            new TableForeignKey({
                name: "FK_TASK_ASSIGNED_TO",
                columnNames: ["assigned_to_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"]
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("task", "FK_TASK_CREATOR");
        await queryRunner.dropForeignKey("task", "FK_TASK_PROJECT");
        await queryRunner.dropForeignKey("task", "FK_TASK_ASSIGNED_BY");
        await queryRunner.dropForeignKey("task", "FK_TASK_ASSIGNED_TO");
        await queryRunner.dropTable("task");
        await queryRunner.query(`DROP TYPE "public"."status_enum"`);
    }
}
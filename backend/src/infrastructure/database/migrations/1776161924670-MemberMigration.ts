import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class MemberMigration1776161924670 implements MigrationInterface {
    name: "MemberMigration1776161924670"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."member_role_enum" AS ENUM('member', 'admin')`
        );

        await queryRunner.createTable(
            new Table({
                name: "member",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "member_uuid", type: "uuid" },
                    { name: "team_uuid", type: "uuid" },
                    { name: "role", type: "member_role_enum", default: "'member'" },
                    { name: "role_by", type: "uuid", isNullable: true },
                    { name: "onboard_by", type: "uuid", isNullable: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true }
                ]
            })
        );

        await queryRunner.createForeignKeys("member", [
            new TableForeignKey({
                columnNames: ["member_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"]
            }),
            new TableForeignKey({
                columnNames: ["team_uuid"],
                referencedTableName: "team",
                referencedColumnNames: ["uuid"]
            }),
            new TableForeignKey({
                columnNames: ["role_by"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"]
            }),
            new TableForeignKey({
                columnNames: ["onboard_by"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"]
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("member");
        await queryRunner.query(`DROP TYPE "public"."member_role_enum"`);
    }
}

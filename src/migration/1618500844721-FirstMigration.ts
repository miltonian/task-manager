import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1618500844721 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS user_id_seq;`);
    await queryRunner.query(`CREATE TABLE "public"."user" (
        "id" int4 NOT NULL DEFAULT nextval('user_id_seq'::regclass),
        "username" varchar NOT NULL,
        "password" varchar NOT NULL,
        "dateCreated" date NOT NULL DEFAULT NOW(),
        "dateUpdated" date NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("id")
    );`);

    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS task_id_seq;`);
    await queryRunner.query(`CREATE TABLE "public"."task" (
        "id" int4 NOT NULL DEFAULT nextval('task_id_seq'::regclass),
        "name" varchar NOT NULL,
        "description" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'New'::character varying,
        "dateCreated" date NOT NULL DEFAULT NOW(),
        "dateUpdated" date NOT NULL DEFAULT NOW(),
        "dueDate" date NOT NULL,
        PRIMARY KEY ("id")
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

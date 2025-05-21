import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeysToTables1746586766321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "branches"
        ADD CONSTRAINT "fk_branch_manager" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL;

      ALTER TABLE "users"
        ADD CONSTRAINT "fk_user_branch" FOREIGN KEY ("id_branch") REFERENCES "branches" ("id"),
        ADD CONSTRAINT "fk_user_level" FOREIGN KEY ("id_level") REFERENCES "levels" ("id"),
        ADD CONSTRAINT "fk_user_position" FOREIGN KEY ("id_position") REFERENCES "positions" ("id"),
        ADD CONSTRAINT "fk_user_trainer" FOREIGN KEY ("trainer_id") REFERENCES "users" ("id") ON DELETE SET NULL;

      ALTER TABLE "projects"
        ADD CONSTRAINT "fk_project_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

      ALTER TABLE "tasks"
        ADD CONSTRAINT "fk_task_project" FOREIGN KEY ("project_code") REFERENCES "projects" ("code"),
        ADD CONSTRAINT "fk_task_assignee" FOREIGN KEY ("assignee_id") REFERENCES "users" ("id");

      ALTER TABLE "working_time"
        ADD CONSTRAINT "fk_working_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_working_approved" FOREIGN KEY ("approved_by") REFERENCES "users" ("id");

      ALTER TABLE "daily_attendances"
        ADD CONSTRAINT "fk_attend_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_attend_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id"),
        ADD CONSTRAINT "fk_attend_project" FOREIGN KEY ("project_code") REFERENCES "projects" ("code"),
        ADD CONSTRAINT "fk_attend_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_attend_request" FOREIGN KEY ("request_id") REFERENCES "requests" ("id"),
        ADD CONSTRAINT "fk_attend_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users" ("id");

      ALTER TABLE "requests"
        ADD CONSTRAINT "fk_request_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_request_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_request_absence" FOREIGN KEY ("absence_type_id") REFERENCES "absence_types" ("id");

      ALTER TABLE "user_project"
        ADD CONSTRAINT "fk_up_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_up_project" FOREIGN KEY ("project_code") REFERENCES "projects" ("code");

      ALTER TABLE "user_role"
        ADD CONSTRAINT "fk_ur_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_ur_role" FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

      ALTER TABLE "role_permission"
        ADD CONSTRAINT "fk_rp_role" FOREIGN KEY ("role_id") REFERENCES "roles" ("id"),
        ADD CONSTRAINT "fk_rp_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id");

      ALTER TABLE "capability_settings"
        ADD CONSTRAINT "fk_cs_position" FOREIGN KEY ("position_id") REFERENCES "positions" ("id"),
        ADD CONSTRAINT "fk_cs_level" FOREIGN KEY ("level_id") REFERENCES "levels" ("id");

      ALTER TABLE "capability_setting_capability"
        ADD CONSTRAINT "fk_csc_setting" FOREIGN KEY ("capability_setting_id") REFERENCES "capability_settings" ("id"),
        ADD CONSTRAINT "fk_csc_capability" FOREIGN KEY ("capability_id") REFERENCES "capabilities" ("id");

      ALTER TABLE "DayOff"
        ADD CONSTRAINT "fk_dayoff_creator" FOREIGN KEY ("CreatedBy") REFERENCES "users" ("id");

      ALTER TABLE "ProjectOTSetting"
        ADD CONSTRAINT "fk_pot_project" FOREIGN KEY ("Projectcode") REFERENCES "projects" ("code"),
        ADD CONSTRAINT "fk_pot_creator" FOREIGN KEY ("CreatedBy") REFERENCES "users" ("id");

      ALTER TABLE "overtime_records"
        ADD CONSTRAINT "fk_or_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_or_project" FOREIGN KEY ("project_code") REFERENCES "projects" ("code"),
        ADD CONSTRAINT "fk_or_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users" ("id"),
        ADD CONSTRAINT "fk_or_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "branches" DROP CONSTRAINT "fk_branch_manager";

      ALTER TABLE "users"
        DROP CONSTRAINT "fk_user_branch",
        DROP CONSTRAINT "fk_user_level",
        DROP CONSTRAINT "fk_user_position",
        DROP CONSTRAINT "fk_user_trainer";

      ALTER TABLE "projects"
        DROP CONSTRAINT "fk_project_customer";

      ALTER TABLE "tasks"
        DROP CONSTRAINT "fk_task_project",
        DROP CONSTRAINT "fk_task_assignee";

      ALTER TABLE "working_time"
        DROP CONSTRAINT "fk_working_user",
        DROP CONSTRAINT "fk_working_approved";

      ALTER TABLE "daily_attendances"
        DROP CONSTRAINT "fk_attend_user",
        DROP CONSTRAINT "fk_attend_task",
        DROP CONSTRAINT "fk_attend_project",
        DROP CONSTRAINT "fk_attend_updated_by",
        DROP CONSTRAINT "fk_attend_request",
        DROP CONSTRAINT "fk_attend_approved_by";

      ALTER TABLE "requests"
        DROP CONSTRAINT "fk_request_user",
        DROP CONSTRAINT "fk_request_approved_by",
        DROP CONSTRAINT "fk_request_absence";

      ALTER TABLE "user_project"
        DROP CONSTRAINT "fk_up_user",
        DROP CONSTRAINT "fk_up_project";

      ALTER TABLE "user_role"
        DROP CONSTRAINT "fk_ur_user",
        DROP CONSTRAINT "fk_ur_role";

      ALTER TABLE "role_permission"
        DROP CONSTRAINT "fk_rp_role",
        DROP CONSTRAINT "fk_rp_permission";

      ALTER TABLE "capability_settings"
        DROP CONSTRAINT "fk_cs_position",
        DROP CONSTRAINT "fk_cs_level";

      ALTER TABLE "capability_setting_capability"
        DROP CONSTRAINT "fk_csc_setting",
        DROP CONSTRAINT "fk_csc_capability";

      ALTER TABLE "DayOff"
        DROP CONSTRAINT "fk_dayoff_creator";

      ALTER TABLE "ProjectOTSetting"
        DROP CONSTRAINT "fk_pot_project",
        DROP CONSTRAINT "fk_pot_creator";

      ALTER TABLE "overtime_records"
        DROP CONSTRAINT "fk_or_user",
        DROP CONSTRAINT "fk_or_project",
        DROP CONSTRAINT "fk_or_approved_by",
        DROP CONSTRAINT "fk_or_task";
    `);
  }
}

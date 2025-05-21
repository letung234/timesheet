import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class SeedData1746607000000 implements MigrationInterface {
  private readonly JWT_SECRET =
    'lkajdflaskdjflekjrngkjwoirweilkajdflaskdjflekjrngkjwoirwei';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop all foreign key constraints first
    await queryRunner.query(`
      ALTER TABLE "branches" DROP CONSTRAINT IF EXISTS "fk_branch_manager";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_branch";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_level";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_position";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_trainer";
      ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "fk_project_customer";
      ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "fk_task_project";
      ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "fk_task_assignee";
      ALTER TABLE "working_time" DROP CONSTRAINT IF EXISTS "fk_working_user";
      ALTER TABLE "working_time" DROP CONSTRAINT IF EXISTS "fk_working_approved";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_user";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_task";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_project";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_updated_by";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_request";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_approved_by";
      ALTER TABLE "requests" DROP CONSTRAINT IF EXISTS "fk_request_user";
      ALTER TABLE "requests" DROP CONSTRAINT IF EXISTS "fk_request_approved_by";
      ALTER TABLE "requests" DROP CONSTRAINT IF EXISTS "fk_request_absence";
      ALTER TABLE "user_project" DROP CONSTRAINT IF EXISTS "fk_up_user";
      ALTER TABLE "user_project" DROP CONSTRAINT IF EXISTS "fk_up_project";
      ALTER TABLE "user_role" DROP CONSTRAINT IF EXISTS "fk_ur_user";
      ALTER TABLE "user_role" DROP CONSTRAINT IF EXISTS "fk_ur_role";
      ALTER TABLE "role_permission" DROP CONSTRAINT IF EXISTS "fk_rp_role";
      ALTER TABLE "role_permission" DROP CONSTRAINT IF EXISTS "fk_rp_permission";
      ALTER TABLE "capability_settings" DROP CONSTRAINT IF EXISTS "fk_cs_position";
      ALTER TABLE "capability_settings" DROP CONSTRAINT IF EXISTS "fk_cs_level";
      ALTER TABLE "capability_setting_capability" DROP CONSTRAINT IF EXISTS "fk_csc_setting";
      ALTER TABLE "capability_setting_capability" DROP CONSTRAINT IF EXISTS "fk_csc_capability";
      ALTER TABLE "DayOff" DROP CONSTRAINT IF EXISTS "fk_dayoff_creator";
      ALTER TABLE "ProjectOTSetting" DROP CONSTRAINT IF EXISTS "fk_pot_project";
      ALTER TABLE "ProjectOTSetting" DROP CONSTRAINT IF EXISTS "fk_pot_creator";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_user";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_project";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_approved_by";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_task";
    `);

    // Insert sample data for levels
    await queryRunner.query(`
      INSERT INTO "levels" ("name", "code", "description", "is_active") VALUES
      ('Junior', 'JUN', 'Junior level employee', true),
      ('Senior', 'SEN', 'Senior level employee', true),
      ('Lead', 'LEAD', 'Team lead', true),
      ('Manager', 'MGR', 'Project manager', true)
    `);

    // Insert sample data for positions
    await queryRunner.query(`
      INSERT INTO "positions" ("name", "code", "is_active") VALUES
      ('Developer', 'DEV', true),
      ('Designer', 'DES', true),
      ('QA Engineer', 'QA', true),
      ('Project Manager', 'PM', true)
    `);

    // Insert sample data for branches
    await queryRunner.query(`
      INSERT INTO "branches" ("name", "code", "address", "phone", "email") VALUES
      ('Head Office', 'HO', '123 Main St, City', '1234567890', 'ho@company.com'),
      ('Branch 1', 'BR1', '456 Branch St, City', '0987654321', 'br1@company.com')
    `);

    // Insert sample data for customers
    await queryRunner.query(`
      INSERT INTO "customers" ("name", "code", "address") VALUES
      ('Customer A', 'CUST001', '789 Customer St, City'),
      ('Customer B', 'CUST002', '321 Client Ave, City')
    `);

    // Insert sample data for permissions
    await queryRunner.query(`
      INSERT INTO "permissions" ("name", "description") VALUES
      ('read:users', 'Can read user data'),
      ('write:users', 'Can modify user data'),
      ('read:projects', 'Can read project data'),
      ('write:projects', 'Can modify project data')
    `);

    // Insert sample data for roles
    await queryRunner.query(`
      INSERT INTO "roles" ("name", "description") VALUES
      ('Admin', 'Administrator role'),
      ('Manager', 'Manager role'),
      ('Employee', 'Regular employee role')
    `);

    // Insert sample data for absence types
    await queryRunner.query(`
      INSERT INTO "absence_types" ("name", "type", "note", "deduct_leave_day") VALUES
      ('Sick Leave', 'SICK', 'Medical leave', true),
      ('Annual Leave', 'ANNUAL', 'Regular annual leave', true),
      ('Unpaid Leave', 'UNPAID', 'Leave without pay', false)
    `);

    // Insert sample data for capabilities
    await queryRunner.query(`
      INSERT INTO "capabilities" ("name", "type") VALUES
      ('Technical Skills', 'Point'),
      ('Soft Skills', 'Point'),
      ('Leadership', 'Point')
    `);

    // Insert sample data for users with hashed passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    await queryRunner.query(`
      INSERT INTO "users" ("avatar", "fullname", "email", "dob", "sex", "start_date", "is_active", "salary", "id_branch", "id_level", "id_position", "password") VALUES
      ('avatar1.jpg', 'John Doe', 'john@company.com', '1990-01-01', 'M', '2023-01-01', true, 5000, 1, 1, 1, '${hashedPassword}'),
      ('avatar2.jpg', 'Jane Smith', 'jane@company.com', '1992-02-02', 'F', '2023-02-01', true, 6000, 1, 2, 2, '${hashedPassword}'),
      ('avatar3.jpg', 'Bob Wilson', 'bob@company.com', '1988-03-03', 'M', '2023-03-01', true, 7000, 2, 3, 3, '${hashedPassword}')
    `);

    // Insert sample data for projects
    await queryRunner.query(`
      INSERT INTO "projects" ("code", "name", "start_date", "end_date", "customer_id") VALUES
      ('PRJ001', 'Project Alpha', '2024-01-01', '2024-06-30', 1),
      ('PRJ002', 'Project Beta', '2024-02-01', '2024-07-31', 2)
    `);

    // Insert sample data for tasks
    await queryRunner.query(`
      INSERT INTO "tasks" ("project_code", "assignee_id", "name", "description", "total_hours", "billable_hours", "status") VALUES
      ('PRJ001', 1, 'Task 1', 'Initial setup', 40, 40, 'pending'),
      ('PRJ001', 2, 'Task 2', 'Development', 60, 60, 'in_progress'),
      ('PRJ002', 3, 'Task 3', 'Testing', 30, 30, 'completed')
    `);

    // Insert sample data for working time
    await queryRunner.query(`
      INSERT INTO "working_time" ("user_id", "name", "start_morning_time", "end_morning_time", "start_afternoon_time", "end_afternoon_time", "status") VALUES
      (1, 'Regular Schedule', '08:00', '12:00', '13:00', '17:00', 'approved'),
      (2, 'Flexible Schedule', '09:00', '13:00', '14:00', '18:00', 'approved')
    `);

    // Insert sample data for daily attendances
    await queryRunner.query(`
      INSERT INTO "daily_attendances" ("user_id", "date", "check_in", "check_out", "tracker_time", "task_id", "project_code", "status") VALUES
      (1, '2024-03-01', '08:00', '17:00', 8, 1, 'PRJ001', 'approved'),
      (2, '2024-03-01', '09:00', '18:00', 8, 2, 'PRJ001', 'approved')
    `);

    // Insert sample data for requests
    await queryRunner.query(`
      INSERT INTO "requests" ("user_id", "type", "date", "time_from", "time_to", "reason", "status", "absence_type_id") VALUES
      (1, 'LEAVE', '2024-03-15', '09:00', '17:00', 'Annual leave', 'pending', 2),
      (2, 'LEAVE', '2024-03-16', '09:00', '17:00', 'Sick leave', 'approved', 1)
    `);

    // Insert sample data for user_project
    await queryRunner.query(`
      INSERT INTO "user_project" ("user_id", "project_code", "role") VALUES
      (1, 'PRJ001', 'Developer'),
      (2, 'PRJ001', 'Designer'),
      (3, 'PRJ002', 'QA')
    `);

    // Insert sample data for user_role
    await queryRunner.query(`
      INSERT INTO "user_role" ("user_id", "role_id") VALUES
      (1, 1),
      (2, 2),
      (3, 3)
    `);

    // Insert sample data for role_permission
    await queryRunner.query(`
      INSERT INTO "role_permission" ("role_id", "permission_id") VALUES
      (1, 1),
      (1, 2),
      (2, 1),
      (3, 1)
    `);

    // Re-add all foreign key constraints
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
    // Drop all foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "branches" DROP CONSTRAINT IF EXISTS "fk_branch_manager";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_branch";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_level";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_position";
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_user_trainer";
      ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "fk_project_customer";
      ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "fk_task_project";
      ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "fk_task_assignee";
      ALTER TABLE "working_time" DROP CONSTRAINT IF EXISTS "fk_working_user";
      ALTER TABLE "working_time" DROP CONSTRAINT IF EXISTS "fk_working_approved";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_user";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_task";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_project";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_updated_by";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_request";
      ALTER TABLE "daily_attendances" DROP CONSTRAINT IF EXISTS "fk_attend_approved_by";
      ALTER TABLE "requests" DROP CONSTRAINT IF EXISTS "fk_request_user";
      ALTER TABLE "requests" DROP CONSTRAINT IF EXISTS "fk_request_approved_by";
      ALTER TABLE "requests" DROP CONSTRAINT IF EXISTS "fk_request_absence";
      ALTER TABLE "user_project" DROP CONSTRAINT IF EXISTS "fk_up_user";
      ALTER TABLE "user_project" DROP CONSTRAINT IF EXISTS "fk_up_project";
      ALTER TABLE "user_role" DROP CONSTRAINT IF EXISTS "fk_ur_user";
      ALTER TABLE "user_role" DROP CONSTRAINT IF EXISTS "fk_ur_role";
      ALTER TABLE "role_permission" DROP CONSTRAINT IF EXISTS "fk_rp_role";
      ALTER TABLE "role_permission" DROP CONSTRAINT IF EXISTS "fk_rp_permission";
      ALTER TABLE "capability_settings" DROP CONSTRAINT IF EXISTS "fk_cs_position";
      ALTER TABLE "capability_settings" DROP CONSTRAINT IF EXISTS "fk_cs_level";
      ALTER TABLE "capability_setting_capability" DROP CONSTRAINT IF EXISTS "fk_csc_setting";
      ALTER TABLE "capability_setting_capability" DROP CONSTRAINT IF EXISTS "fk_csc_capability";
      ALTER TABLE "DayOff" DROP CONSTRAINT IF EXISTS "fk_dayoff_creator";
      ALTER TABLE "ProjectOTSetting" DROP CONSTRAINT IF EXISTS "fk_pot_project";
      ALTER TABLE "ProjectOTSetting" DROP CONSTRAINT IF EXISTS "fk_pot_creator";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_user";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_project";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_approved_by";
      ALTER TABLE "overtime_records" DROP CONSTRAINT IF EXISTS "fk_or_task";
    `);

    // Delete all seeded data
    await queryRunner.query(`
      DELETE FROM "overtime_records";
      DELETE FROM "ProjectOTSetting";
      DELETE FROM "DayOff";
      DELETE FROM "capability_setting_capability";
      DELETE FROM "capability_settings";
      DELETE FROM "role_permission";
      DELETE FROM "user_role";
      DELETE FROM "user_project";
      DELETE FROM "requests";
      DELETE FROM "daily_attendances";
      DELETE FROM "working_time";
      DELETE FROM "tasks";
      DELETE FROM "projects";
      DELETE FROM "users";
      DELETE FROM "capabilities";
      DELETE FROM "absence_types";
      DELETE FROM "roles";
      DELETE FROM "permissions";
      DELETE FROM "customers";
      DELETE FROM "branches";
      DELETE FROM "positions";
      DELETE FROM "levels";
    `);

    // Re-add all foreign key constraints
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
}

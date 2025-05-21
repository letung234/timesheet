import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1746523428293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Levels
    await queryRunner.query(`
      CREATE TABLE "levels" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "code" VARCHAR UNIQUE NOT NULL,
        "description" TEXT,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Positions
    await queryRunner.query(`
      CREATE TABLE "positions" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "code" VARCHAR UNIQUE NOT NULL,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Branches
    await queryRunner.query(`
      CREATE TABLE "branches" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "code" VARCHAR UNIQUE NOT NULL,
        "address" TEXT,
        "phone" VARCHAR,
        "email" VARCHAR,
        "manager_id" INTEGER,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Customers
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "code" VARCHAR NOT NULL,
        "address" VARCHAR,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Permissions
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR UNIQUE NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Roles
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR UNIQUE NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Absence Types
    await queryRunner.query(`
      CREATE TABLE "absence_types" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "type" VARCHAR,
        "note" TEXT,
        "deduct_leave_day" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Capabilities
    await queryRunner.query(`
      CREATE TABLE "capabilities" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "type" VARCHAR DEFAULT 'Point',
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "avatar" VARCHAR,
        "fullname" VARCHAR,
        "email" VARCHAR,
        "dob" DATE,
        "sex" VARCHAR,
        "start_date" DATE,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "salary" DECIMAL,
        "salary_at" DATE,
        "id_branch" INTEGER,
        "id_level" INTEGER,
        "id_position" INTEGER,
        "skill" VARCHAR,
        "remain_leave_day" INTEGER,
        "bank" VARCHAR,
        "bank_account" VARCHAR,
        "tax_code" VARCHAR,
        "emergency_contact" VARCHAR,
        "emergency_contact_phone" VARCHAR,
        "insurance_status" VARCHAR,
        "identify" VARCHAR,
        "place_of_origin" VARCHAR,
        "place_of_residence" VARCHAR,
        "current_address" VARCHAR,
        "date_of_issue" DATE,
        "issued_by" VARCHAR,
        "trainer_id" INTEGER
      )
    `);

    // Projects
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "code" VARCHAR PRIMARY KEY,
        "name" VARCHAR NOT NULL UNIQUE,
        "start_date" DATE,
        "end_date" DATE,
        "note" TEXT,
        "customer_id" INTEGER,
        "project_type" VARCHAR,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Tasks
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" SERIAL PRIMARY KEY,
        "project_code" VARCHAR NOT NULL,
        "assignee_id" INTEGER NOT NULL,
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "total_hours" DECIMAL DEFAULT 0,
        "billable_hours" DECIMAL DEFAULT 0,
        "is_billable" BOOLEAN DEFAULT true,
        "status" VARCHAR DEFAULT 'pending',
        "priority" VARCHAR DEFAULT 'normal',
        "due_date" DATE,
        "started_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now() 
      )
    `);

    // Working Time
    await queryRunner.query(`
      CREATE TABLE "working_time" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "name" VARCHAR,
        "description" TEXT,
        "start_morning_time" TIME,
        "end_morning_time" TIME,
        "start_afternoon_time" TIME,
        "end_afternoon_time" TIME,
        "request_time" TIMESTAMP,
        "apply_date" DATE,
        "approved_by" INTEGER,
        "approved_at" TIMESTAMP,
        "status" VARCHAR,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()  
      )
    `);

    // Daily Attendances
    await queryRunner.query(`
      CREATE TABLE "daily_attendances" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "date" DATE NOT NULL,
        "check_in" TIME,
        "check_out" TIME,
        "tracker_time" DECIMAL,
        "task_id" INTEGER,
        "project_code" VARCHAR,
        "punishment_money" DECIMAL,
        "complain" TEXT,
        "reply_complain" TEXT,
        "updated_by" INTEGER,
        "status" VARCHAR,
        "request_id" INTEGER,
        "note" TEXT,
        "approved_by" INTEGER,
        "approved_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Requests
    await queryRunner.query(`
      CREATE TABLE "requests" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "type" VARCHAR,
        "date" DATE,
        "time_from" TIME,
        "time_to" TIME,
        "reason" TEXT,
        "status" VARCHAR,
        "approved_by" INTEGER,
        "approved_at" TIMESTAMP,
        "absence_type_id" INTEGER,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // User_Project
    await queryRunner.query(`
      CREATE TABLE "user_project" (
        "user_id" INTEGER NOT NULL,
        "project_code" VARCHAR NOT NULL,
        "role" VARCHAR,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        PRIMARY KEY ("user_id", "project_code")
      )
    `);

    // User_Role
    await queryRunner.query(`
      CREATE TABLE "user_role" (
        "user_id" INTEGER NOT NULL,
        "role_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        PRIMARY KEY ("user_id", "role_id")
      )
    `);

    // Role_Permission
    await queryRunner.query(`
      CREATE TABLE "role_permission" (
        "role_id" INTEGER NOT NULL,
        "permission_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        PRIMARY KEY ("role_id", "permission_id")
      )
    `);

    // Capability_Settings
    await queryRunner.query(`
      CREATE TABLE "capability_settings" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "position_id" INTEGER NOT NULL,
        "level_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        UNIQUE ("position_id", "level_id")
      )
    `);

    // Capability_Setting_Capability
    await queryRunner.query(`
      CREATE TABLE "capability_setting_capability" (
        "id" SERIAL PRIMARY KEY,
        "capability_setting_id" INTEGER NOT NULL,
        "capability_id" INTEGER NOT NULL,
        "coefficient" INTEGER DEFAULT 1,
        "guideline" TEXT,
        UNIQUE ("capability_setting_id", "capability_id")
      )
    `);

    // DayOff
    await queryRunner.query(`
      CREATE TABLE "DayOff" (
        "DayOffID" SERIAL PRIMARY KEY,
        "Date" DATE NOT NULL,
        "Note" TEXT,
        "OTCoefficient" FLOAT NOT NULL DEFAULT 1.0,
        "CreatedBy" INTEGER NOT NULL,
        "CreatedAt" TIMESTAMP DEFAULT now(),
        UNIQUE ("Date")
      )
    `);

    // ProjectOTSetting
    await queryRunner.query(`
      CREATE TABLE "ProjectOTSetting" (
        "ProjectOTID" SERIAL PRIMARY KEY,
        "Projectcode" VARCHAR NOT NULL,
        "DateAt" DATE NOT NULL,
        "OTCoefficient" FLOAT NOT NULL DEFAULT 1.0,
        "Note" TEXT,
        "CreatedBy" INTEGER NOT NULL,
        "CreatedAt" TIMESTAMP DEFAULT now(),
        UNIQUE ("Projectcode", "DateAt")
      )
    `);

    // Overtime_Records
    await queryRunner.query(`
      CREATE TABLE "overtime_records" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "project_code" VARCHAR NOT NULL,
        "date" DATE,
        "hours" DECIMAL,
        "coefficient" FLOAT,
        "status" VARCHAR,
        "approved_by" INTEGER,
        "approved_at" TIMESTAMP,
        "reason" TEXT,
        "task_id" INTEGER,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "overtime_records"`);
    await queryRunner.query(`DROP TABLE "ProjectOTSetting"`);
    await queryRunner.query(`DROP TABLE "DayOff"`);
    await queryRunner.query(`DROP TABLE "capability_setting_capability"`);
    await queryRunner.query(`DROP TABLE "capability_settings"`);
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "user_project"`);
    await queryRunner.query(`DROP TABLE "requests"`);
    await queryRunner.query(`DROP TABLE "daily_attendances"`);
    await queryRunner.query(`DROP TABLE "working_time"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "capabilities"`);
    await queryRunner.query(`DROP TABLE "absence_types"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "branches"`);
    await queryRunner.query(`DROP TABLE "positions"`);
    await queryRunner.query(`DROP TABLE "levels"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRbacTables1709123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.query(`
      CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Create role_permission table
    await queryRunner.query(`
      CREATE TABLE role_permission (
        id SERIAL PRIMARY KEY,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE(role_id, permission_id)
      );
    `);

    // Create user_role table
    await queryRunner.query(`
      CREATE TABLE user_role (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, role_id)
      );
    `);

    // Insert default admin role
    await queryRunner.query(`
      INSERT INTO roles (name, description)
      VALUES ('admin', 'Administrator with full access');
    `);

    // Insert default permissions
    await queryRunner.query(`
      INSERT INTO permissions (name, description) VALUES
      ('manage_users', 'Can manage users'),
      ('manage_roles', 'Can manage roles'),
      ('manage_permissions', 'Can manage permissions'),
      ('view_dashboard', 'Can view dashboard'),
      ('manage_projects', 'Can manage projects'),
      ('manage_tasks', 'Can manage tasks'),
      ('manage_timesheets', 'Can manage timesheets');
    `);

    // Assign all permissions to admin role
    await queryRunner.query(`
      INSERT INTO role_permission (role_id, permission_id)
      SELECT 1, id FROM permissions;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_role;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permission;`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
  }
}

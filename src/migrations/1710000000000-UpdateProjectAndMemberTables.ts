import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProjectAndMemberTables1710000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing foreign key constraints
    await queryRunner.query(`
      ALTER TABLE project_members
      DROP FOREIGN KEY IF EXISTS FK_project_members_project;
      ALTER TABLE project_members
      DROP FOREIGN KEY IF EXISTS FK_project_members_user;
      ALTER TABLE project_members
      DROP FOREIGN KEY IF EXISTS FK_project_members_added_by;
    `);

    // Update project_members table
    await queryRunner.query(`
      ALTER TABLE project_members
      MODIFY COLUMN project_id VARCHAR(255) NOT NULL;
    `);

    // Add foreign key constraints back
    await queryRunner.query(`
      ALTER TABLE project_members
      ADD CONSTRAINT FK_project_members_project
      FOREIGN KEY (project_id) REFERENCES projects(code)
      ON DELETE CASCADE;
      
      ALTER TABLE project_members
      ADD CONSTRAINT FK_project_members_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE;
      
      ALTER TABLE project_members
      ADD CONSTRAINT FK_project_members_added_by
      FOREIGN KEY (added_by) REFERENCES users(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE project_members
      DROP FOREIGN KEY IF EXISTS FK_project_members_project;
      ALTER TABLE project_members
      DROP FOREIGN KEY IF EXISTS FK_project_members_user;
      ALTER TABLE project_members
      DROP FOREIGN KEY IF EXISTS FK_project_members_added_by;
    `);

    // Revert project_members table
    await queryRunner.query(`
      ALTER TABLE project_members
      MODIFY COLUMN project_id INT NOT NULL;
    `);

    // Add foreign key constraints back
    await queryRunner.query(`
      ALTER TABLE project_members
      ADD CONSTRAINT FK_project_members_project
      FOREIGN KEY (project_id) REFERENCES projects(id)
      ON DELETE CASCADE;
      
      ALTER TABLE project_members
      ADD CONSTRAINT FK_project_members_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE;
      
      ALTER TABLE project_members
      ADD CONSTRAINT FK_project_members_added_by
      FOREIGN KEY (added_by) REFERENCES users(id)
      ON DELETE CASCADE;
    `);
  }
}

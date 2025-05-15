export enum Permission {
  // User permissions
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  MANAGE_USER_ROLES = 'manage:user:roles',
  MANAGE_USER_STATUS = 'manage:user:status',
  MANAGE_USER_SALARY = 'manage:user:salary',

  // Project permissions
  CREATE_PROJECT = 'create:project',
  READ_PROJECT = 'read:project',
  UPDATE_PROJECT = 'update:project',
  DELETE_PROJECT = 'delete:project',
  MANAGE_PROJECT_MEMBERS = 'manage:project:members',

  // Task permissions
  CREATE_TASK = 'create:task',
  READ_TASK = 'read:task',
  UPDATE_TASK = 'update:task',
  DELETE_TASK = 'delete:task',
  ASSIGN_TASK = 'assign:task',

  // Timesheet permissions
  CREATE_TIMESHEET = 'create:timesheet',
  READ_TIMESHEET = 'read:timesheet',
  UPDATE_TIMESHEET = 'update:timesheet',
  DELETE_TIMESHEET = 'delete:timesheet',
  SUBMIT_TIMESHEET = 'submit:timesheet',
  APPROVE_TIMESHEET = 'approve:timesheet',
  REJECT_TIMESHEET = 'reject:timesheet',
  VIEW_TEAM_TIMESHEETS = 'view:team:timesheets',
  VIEW_PROJECT_TIMESHEETS = 'view:project:timesheets',

  // Attendance permissions
  CREATE_ATTENDANCE = 'create:attendance',
  READ_ATTENDANCE = 'read:attendance',
  UPDATE_ATTENDANCE = 'update:attendance',
  DELETE_ATTENDANCE = 'delete:attendance',
  APPROVE_ATTENDANCE = 'approve:attendance',

  // Request permissions
  CREATE_REQUEST = 'create:request',
  READ_REQUEST = 'read:request',
  UPDATE_REQUEST = 'update:request',
  DELETE_REQUEST = 'delete:request',
  APPROVE_REQUEST = 'approve:request',

  // System permissions
  MANAGE_ROLES = 'manage:roles',
  MANAGE_PERMISSIONS = 'manage:permissions',
  VIEW_AUDIT_LOGS = 'view:audit:logs',

  // User permissions
  VIEW_USER_ROLES = 'view:user:roles',
  ASSIGN_USER_ROLE = 'assign:user:role',
  REMOVE_USER_ROLE = 'remove:user:role',
  TOGGLE_USER_ACTIVE = 'toggle:user:active',
  CHANGE_USER_PASSWORD = 'change:user:password',

  // Customer permissions
  CREATE_CUSTOMER = 'create:customer',
  READ_CUSTOMER = 'read:customer',
  UPDATE_CUSTOMER = 'update:customer',
  DELETE_CUSTOMER = 'delete:customer',

  // Project OT Setting permissions
  CREATE_PROJECT_OT_SETTING = 'create:project:ot:setting',
  READ_PROJECT_OT_SETTING = 'read:project:ot:setting',
  UPDATE_PROJECT_OT_SETTING = 'update:project:ot:setting',
  DELETE_PROJECT_OT_SETTING = 'delete:project:ot:setting',

  // Absence permissions
  CREATE_ABSENCE = 'create:absence',
  READ_ABSENCE = 'read:absence',
  UPDATE_ABSENCE = 'update:absence',
  DELETE_ABSENCE = 'delete:absence',
  APPROVE_ABSENCE = 'approve:absence',

  // Overtime permissions
  CREATE_OVERTIME = 'create:overtime',
  READ_OVERTIME = 'read:overtime',
  UPDATE_OVERTIME = 'update:overtime',
  DELETE_OVERTIME = 'delete:overtime',
  APPROVE_OVERTIME = 'approve:overtime',

  // Capability permissions
  MANAGE_CAPABILITIES = 'manage:capabilities',
  ASSIGN_CAPABILITIES = 'assign:capabilities',
  VIEW_CAPABILITIES = 'view:capabilities',

  // Branch permissions
  CREATE_BRANCH = 'create:branch',
  READ_BRANCH = 'read:branch',
  UPDATE_BRANCH = 'update:branch',
  DELETE_BRANCH = 'delete:branch',

  // level permissions
  CREATE_LEVEL = 'create:level',
  READ_LEVEL = 'read:level',
  UPDATE_LEVEL = 'update:level',
  DELETE_LEVEL = 'delete:level',

  // position permissions
  CREATE_POSITION = 'create:position',
  READ_POSITION = 'read:position',
  UPDATE_POSITION = 'update:position',
  DELETE_POSITION = 'delete:position',

  // day off permissions
  CREATE_DAY_OFF = 'create:day:off',
  READ_DAY_OFF = 'read:day:off',
  UPDATE_DAY_OFF = 'update:day:off',
  DELETE_DAY_OFF = 'delete:day:off',
  APPROVE_DAY_OFF = 'approve:day:off',
}

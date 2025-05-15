export interface FindUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FindUsersResult {
  users: any[];
  total: number;
  page: number;
  limit: number;
}

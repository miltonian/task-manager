declare namespace UserAPI {
  export interface User {
    id: number;
    username: string;
    password?: string;
    dateCreated: string;
    dateUpdated: string;
  }

  export interface LoginRequest {
    username: string;
    password: string;
  }
}

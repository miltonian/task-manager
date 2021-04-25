declare namespace TaskAPI {
  export interface Task {
    id: number;
    name: string;
    description: string;
    status: Status;
    dateCreated: string;
    dateUpdated: string;
    dueDate: string;
  }

  export type Status = 'New' | 'Completed';

  export interface UpdateTaskRequest {
    id: number;
    name: string;
    description: string;
    status: Status;
    dueDate: string;
  }
}

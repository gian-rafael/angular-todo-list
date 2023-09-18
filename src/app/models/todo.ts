export type Status = "completed" | "pending";

export type Priority = "low" | "medium" | "high";

export interface PriorityOption {
  name: string;
  value: Priority;
}

export interface Todo {
  id: number;
  task: string;
  status: Status;
  priority: Priority;
}

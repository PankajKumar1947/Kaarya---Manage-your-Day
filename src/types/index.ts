export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  created_at?: string;
}

export interface Todo {
  id: number;
  user_id?: number;
  title: string;
  completed: number;
  created_at?: string;
}

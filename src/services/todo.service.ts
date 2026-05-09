import { db } from "@/db";
import { Todo } from "@/types";
import { handleServiceOp, ServiceError } from "@/utils/service-utils";

export const todoService = {
  addTodo: async (userId: number, title: string, date: string) => {
    return handleServiceOp(async () => {
      const result = await db.runAsync(
        `
        INSERT INTO todos (
          user_id,
          title,
          completed,
          date,
          created_at
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [userId, title, 0, date, new Date().toISOString()]
      );

      const todo = await db.getFirstAsync<Todo>(
        'SELECT * FROM todos WHERE id = ?',
        [result.lastInsertRowId]
      );

      if (!todo) throw ServiceError.Internal("Failed to retrieve created todo");
      return todo;
    }, "Failed to add todo", 201);
  },

  getTodosByDate: async (userId: number, date: string) => {
    return handleServiceOp(async () => {
      return await db.getAllAsync<Todo>(
        `
        SELECT *
        FROM todos
        WHERE user_id = ? AND date = ?
        ORDER BY created_at DESC
        `,
        [userId, date]
      );
    }, "Failed to fetch todos");
  },

  toggleTodo: async (id: number) => {
    return handleServiceOp(async () => {
      const todo = await db.getFirstAsync<Todo>(
        'SELECT * FROM todos WHERE id = ?',
        [id]
      );

      if (!todo) throw ServiceError.NotFound("Todo not found");

      const updatedCompleted = todo.completed === 1 ? 0 : 1;

      await db.runAsync(
        `
        UPDATE todos
        SET completed = ?
        WHERE id = ?
        `,
        [updatedCompleted, id]
      );

      const updatedTodo = await db.getFirstAsync<Todo>(
        'SELECT * FROM todos WHERE id = ?',
        [id]
      );

      if (!updatedTodo) throw ServiceError.Internal("Failed to retrieve updated todo");
      return updatedTodo;
    }, "Failed to toggle todo");
  },

  deleteTodo: async (id: number) => {
    return handleServiceOp(async () => {
      const todo = await db.getFirstAsync<Todo>(
        'SELECT * FROM todos WHERE id = ?',
        [id]
      );

      if (!todo) throw ServiceError.NotFound("Todo not found");

      await db.runAsync(
        'DELETE FROM todos WHERE id = ?',
        [id]
      );

      return todo;
    }, "Failed to delete todo");
  },
};
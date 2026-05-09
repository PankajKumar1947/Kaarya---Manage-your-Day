import { db } from "@/db";
import { Todo } from "@/types";
import { handleServiceOp, ServiceError } from "@/utils/service-utils";

export const todoService = {
  addTodo: async (title: string) => {
    return handleServiceOp(async () => {
      const result = await db.runAsync(
        `
        INSERT INTO todos (
          title,
          completed,
          created_at
        )
        VALUES (?, ?, ?)
        `,
        [title, 0, new Date().toISOString()]
      );

      const todo = await db.getFirstAsync<Todo>(
        'SELECT * FROM todos WHERE id = ?',
        [result.lastInsertRowId]
      );

      if (!todo) throw ServiceError.Internal("Failed to retrieve created todo");
      return todo;
    }, "Failed to add todo", 201);
  },

  getTodos: async () => {
    return handleServiceOp(async () => {
      return await db.getAllAsync<Todo>(
        `
        SELECT *
        FROM todos
        ORDER BY created_at DESC
        `
      );
    }, "Failed to fetch todos");
  },

  updateTodo: async (id: number, title: string) => {
    return handleServiceOp(async () => {
      const result = await db.runAsync(
        `
        UPDATE todos
        SET title = ?
        WHERE id = ?
        `,
        [title, id]
      );

      if (result.changes === 0) throw ServiceError.NotFound("Todo not found");

      const updatedTodo = await db.getFirstAsync<Todo>(
        'SELECT * FROM todos WHERE id = ?',
        [id]
      );

      if (!updatedTodo) throw ServiceError.Internal("Failed to retrieve updated todo");
      return updatedTodo;
    }, "Failed to update todo");
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
import { db } from "@/db";
import { User } from "@/types";
import { handleServiceOp, ServiceError } from "@/utils/service-utils";

export const authService = {
  login: async (email: string, password: string) => {
    return handleServiceOp(async () => {
      const user = await db.getFirstAsync<User>(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
      );

      if (!user) {
        throw ServiceError.NotFound("User does not exist");
      }

      if (user.password !== password) {
        throw ServiceError.Unauthorized("Invalid password");
      }

      return user;
    }, "Failed to login");
  },

  signup: async (name: string, email: string, password: string) => {
    return handleServiceOp(async () => {
      // Check for existing user
      const existingUser = await db.getFirstAsync<User>(
        `
        SELECT id FROM users WHERE email = ?
        `,
        [email]
      );

      if (existingUser) {
        throw ServiceError.Conflict("Email already exists");
      }

      const result = await db.runAsync(
        `
        INSERT INTO users (
          name,
          email,
          password,
          created_at
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          name,
          email,
          password,
          new Date().toISOString(),
        ]
      );

      const user = await db.getFirstAsync<User>(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [result.lastInsertRowId]
      );

      if (!user) throw ServiceError.Internal("Failed to retrieve created user");
      return user;
    }, "Failed to signup", 201);
  },

  getUserById: async (id: number) => {
    return handleServiceOp(async () => {
      const user = await db.getFirstAsync<User>(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [id]
      );

      if (!user) throw ServiceError.NotFound("User not found");
      return user;
    }, "Failed to fetch user");
  },

  deleteUser: async (id: number) => {
    return handleServiceOp(async () => {
      const user = await db.getFirstAsync<User>(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [id]
      );

      if (!user) throw ServiceError.NotFound("User not found");

      await db.runAsync(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [id]
      );

      return user;
    }, "Failed to delete user");
  },
};
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Todo } from '@/types';
import { todoService } from '@/services/todo.service';
import { useAuth } from './auth-context';

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  fetchTodos: (date: string) => Promise<void>;
  addTodo: (title: string, date: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodos = useCallback(async (date: string) => {
    if (!user?.id) return;
    setIsLoading(true);
    const result = await todoService.getTodosByDate(user.id, date);
    if (result.status === "ok") {
      setTodos(result.data);
    }
    setIsLoading(false);
  }, [user?.id]);

  const addTodo = async (title: string, date: string) => {
    if (!user?.id) return;
    const result = await todoService.addTodo(user.id, title, date);
    if (result.status === "ok") {
      setTodos(prev => [result.data, ...prev]);
    }
  };

  const toggleTodo = async (id: number) => {
    const result = await todoService.toggleTodo(id);
    if (result.status === "ok") {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? result.data : todo
      ));
    }
  };

  const deleteTodo = async (id: number) => {
    const result = await todoService.deleteTodo(id);
    if (result.status === "ok") {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  return (
    <TodoContext.Provider value={{ todos, isLoading, fetchTodos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

import React, { createContext, useContext, useState } from 'react';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', title: 'Finish mobile app design', completed: false },
    { id: '2', title: 'Call the doctor at 3pm', completed: true },
    { id: '3', title: 'Buy groceries for the week', completed: false },
  ]);

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
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

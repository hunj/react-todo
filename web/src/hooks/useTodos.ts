'use client';

import { useState, useEffect } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

const STORAGE_KEY = 'todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedTodos = JSON.parse(stored).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, loading]);

  const createTodo = (input: CreateTodoInput): Todo => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description || '',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  const updateTodo = (id: string, input: UpdateTodoInput): Todo | null => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          ...input,
          updatedAt: new Date(),
        };
      }
      return todo;
    }));
    
    return todos.find(todo => todo.id === id) || null;
  };

  const deleteTodo = (id: string): boolean => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    return true;
  };

  const toggleTodo = (id: string): Todo | null => {
    return updateTodo(id, { completed: !todos.find(t => t.id === id)?.completed });
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const getTodoById = (id: string): Todo | undefined => {
    return todos.find(todo => todo.id === id);
  };

  return {
    todos,
    loading,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    getTodoById,
  };
}

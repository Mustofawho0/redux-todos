import { createSlice } from '@reduxjs/toolkit';

export interface Todo {
  id: number;
  title: string;
  status: string;
}

export interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};
export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        status: 'Processing',
      };
      state.todos.push(newTodo);
    },
    updateTodo: (state, action) => {
      const { id, title } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.title = title;
      }
    },
    deleteTodo: (state, action) => {
      const id = action.payload.id;
      state.todos = state.todos.filter((todo) => todo.id !== id);
    },
    statusTodo: (state, action) => {
      const { id, status } = action.payload;
      const statusTodo = state.todos.find((todo) => todo.id === id);
      if (statusTodo) {
        statusTodo.status = status;
      }
    },
  },
});

export const { addTodo, updateTodo, deleteTodo, statusTodo } =
  todoSlice.actions;
export default todoSlice.reducer;

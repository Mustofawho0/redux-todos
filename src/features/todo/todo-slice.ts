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
        status: 'processing',
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
  },
});

export const { addTodo, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;

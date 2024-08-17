import { createSlice } from '@reduxjs/toolkit';

export interface Todo {
  id: number;
  title: string;
  status: string;
}
export interface TodoState {
  todos: Todo[];
  filter: Todo[];
}

const initialState: TodoState = {
  todos: [],
  filter: [],
};
export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        status: 'In Progress',
      };
      state.todos.push(newTodo);
      state.filter.push(newTodo);
    },
    updateTodo: (state, action) => {
      const { id, title } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.title = title;
      }
      const filterTodo = state.filter.find((todo) => todo.id === id);
      if (filterTodo) {
        filterTodo.title = title;
      }
    },
    deleteTodo: (state, action) => {
      const id = action.payload.id;
      state.todos = state.todos.filter((todo) => todo.id !== id);
      state.filter = state.filter.filter((todo) => todo.id !== id);
    },
    statusTodo: (state, action) => {
      const { id, status } = action.payload;
      const statusTodo = state.todos.find((todo) => todo.id === id);
      if (statusTodo) {
        statusTodo.status = status;
      }
      state.filter = state.filter.map((todo) =>
        todo.id === id ? { ...todo, status } : todo
      );

      // state.filter = state.todos.filter((todo) => {
      //   if (todo.id === id) {
      //     return status !== 'Done';
      //   }
      //   return true;
      // });
    },
    filterTodo: (state, action) => {
      const { status } = action.payload;
      if (status === 'All') {
        state.filter = state.todos;
      } else {
        state.filter = state.todos.filter((todo) => todo.status === status);
      }
    },
  },
});

export const { addTodo, updateTodo, deleteTodo, statusTodo, filterTodo } =
  todoSlice.actions;
export default todoSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
export interface Todo {
  id: string;
  title: string;
  status: string;
  priority?: boolean;
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
        id: `TASK - ${Math.floor(Math.random() * 12345)}`,
        title: action.payload.title,
        status: 'In Progress',
        priority: false,
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
    },
    filterTodo: (state, action) => {
      const { status } = action.payload;
      if (status === 'All') {
        state.filter = state.todos;
      } else {
        state.filter = state.todos.filter((todo) => todo.status === status);
      }
    },
    priorityTodo: (state, action) => {
      const { id } = action.payload;
      const priorityTodo = state.todos.find((todo) => todo.id === id);
      if (priorityTodo) {
        priorityTodo.priority = !priorityTodo.priority;
      }

      state.filter = state.todos.sort((a, b) => {
        if (a.priority === b.priority) {
          return 0;
        }
        return a.priority ? -1 : 1;
      });

      state.filter = state.todos.filter(
        (todo) => todo.priority || todo.status === 'In Progress'
      );
    },
  },
});

export const {
  addTodo,
  updateTodo,
  deleteTodo,
  statusTodo,
  filterTodo,
  priorityTodo,
} = todoSlice.actions;
export default todoSlice.reducer;

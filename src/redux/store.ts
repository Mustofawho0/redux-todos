'use client';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import todoReducer from '@/features/todo/todo-slice';
import { loadState } from '@/local/browser-storage';

const reducers = combineReducers({
  todos: todoReducer,
});

export const store = configureStore({
  devTools: true,
  reducer: reducers,
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

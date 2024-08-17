'use client';
import { Provider } from 'react-redux';
import { store } from './store';
import { saveState } from '@/local/browser-storage';
import debounce from 'debounce';
import { useEffect } from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    store.subscribe(
      debounce(() => {
        saveState(store.getState());
      }, 1000)
    );
  });

  return <Provider store={store}>{children}</Provider>;
};

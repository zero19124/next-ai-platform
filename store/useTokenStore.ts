// store.js
import { create } from 'zustand'
export const useTokenStore = create<{
  accessToken: string;
  setToken: (accessToken: string) => void;
}>((set) => ({
  accessToken: "",
  setToken: (accessToken: string) =>
    set(() => ({
      accessToken: accessToken,
    })),
}));

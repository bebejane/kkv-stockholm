import { create } from "zustand";
import { shallow } from 'zustand/shallow';

export interface StoreState {
  showMenu: boolean,
  setShowMenu: (showMenu: boolean) => void,
}

const useStore = create<StoreState>((set) => ({
  showMenu: false,
  setShowMenu: (showMenu) => set({ showMenu }),
}));

export { shallow, useStore };

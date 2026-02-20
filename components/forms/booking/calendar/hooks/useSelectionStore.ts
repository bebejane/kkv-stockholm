import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';

export interface StoreState {
	selection: [Date, Date] | null;
	setSelection: (selection: [Date, Date] | null) => void;
	reset: () => void;
}

const useSelectionStore = create<StoreState>((set) => ({
	selection: null,
	setSelection: (selection) => set({ selection }),
	reset: () => set({ selection: null }),
}));

export { useShallow, useSelectionStore };

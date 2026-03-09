import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type AppState = {
    user: any | null;
};

type AppActions = {
    setUser: (user: any | null) => void;
};

export const useAppStore = create<AppState & AppActions>()(
    immer((set) => ({
        user: null,
        setUser: (user) =>
            set((state) => {
                state.user = user;
            })
    }))
);

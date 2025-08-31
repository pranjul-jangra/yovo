import { create } from "zustand";

const useLoaderStore = create(
    (set) => ({
        screenLoader: false,
        setScreenLoader: (value) => set({ screenLoader: value }), 
    })
);

export default useLoaderStore;
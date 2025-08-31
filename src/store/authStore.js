import { create } from "zustand";

const useAuthStore = create(
    (set) => ({
        token: '',
        user: {},
        otherUser: {},
        rateLimitExceeded: false,
        retryAfter: 60,

        setAccessToken: (token) => set({ token }),
        setUser: (user) => set({ user }),
        setOtherUser: (otherUser) => set({ otherUser }),
        resetAuth: () => set({ token: '', user: null, otherUser: null, rateLimitExceeded: false }),

        setRateLimitExceeded: (status) => set({ rateLimitExceeded: status }),
        setRetryAfter: (retryAfter) => set({ retryAfter })
    })
)


export default useAuthStore;
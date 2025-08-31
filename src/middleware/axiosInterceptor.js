import axios from "axios";
import useAuthStore from "../store/authStore";

let refreshPromise = null;

const interceptor = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
});

interceptor.interceptors.request.use(
    (config) => {
        // Don't modify Content-Type for FormData/multipart requests
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type']; // Let browser set it
        }

        // Setting token
        const { token } = useAuthStore.getState();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        
        return config;
    },
    (error) => Promise.reject(error)
);

interceptor.interceptors.response.use(
    response => response,

    async (error) => {
        const originalRequest = error.config;
        const { setAccessToken, resetAuth, setRateLimitExceeded, setRetryAfter } = useAuthStore.getState();

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh')) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = axios.get('/api/auth/refresh-token', {
                        baseURL: import.meta.env.VITE_SERVER_URL,
                        withCredentials: true
                    }).finally(() => {
                        refreshPromise = null;
                    });
                }

                const response = await refreshPromise;
                const newToken = response.data?.accessToken;

                if (newToken) {
                    setAccessToken(newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return interceptor(originalRequest);
                }

                resetAuth();
                return Promise.reject(new Error("Token refresh failed"));

            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                resetAuth();
                return Promise.reject(refreshError);
            }
        }

        // Handle 429 Rate Limit
        if (error.response?.status === 429) {

            const retryAfterText = error.response.data?.retryAfter || "60s";
            const retrySeconds = parseInt(retryAfterText.replace(/[^\d]/g, "")) || 60;

            setRetryAfter(retrySeconds);
            setRateLimitExceeded(true);

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default interceptor;

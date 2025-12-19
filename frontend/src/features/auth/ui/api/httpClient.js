import axios from 'axios';
import useAuthStore from '../../authStore';

const api = axios.create({
    withCredentials: true,
});

const refreshClient = axios.create({
    withCredentials: true,
});

const storeAccessToken = (token) => {
    if (!token) return;
    const store = useAuthStore.getState ? useAuthStore.getState() : null;
    if (store?.setAccessToken) store.setAccessToken(token);
};

api.interceptors.request.use((config) => {
    const store = useAuthStore.getState ? useAuthStore.getState() : null;
    const token = store?.accessToken;
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshPromise = null;

api.interceptors.response.use(
    (response) => {
        const newToken = response?.data?.accessToken || response?.data?.token;
        storeAccessToken(newToken);
        return response;
    },
    async (error) => {
        const status = error.response?.status;
        const originalRequest = error.config;

        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            refreshPromise =
                refreshPromise ||
                refreshClient
                    .post('/auth/refresh')
                    .then((res) => {
                        refreshPromise = null;
                        const newToken = res.data?.accessToken || res.data?.token;
                        storeAccessToken(newToken);
                        return newToken;
                    })
                    .catch((refreshError) => {
                        refreshPromise = null;
                        const store = useAuthStore.getState ? useAuthStore.getState() : null;
                        if (store?.clearAuth) store.clearAuth();
                        throw refreshError;
                    });

            const newToken = await refreshPromise;
            if (newToken) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

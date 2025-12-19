import useAuthStore from '../../authStore';
import api from './httpClient';

export const useLogin = () => {
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);

    const login = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const identifier = formData.get('identifier');
        const password = formData.get('password');

        try {
            const response = await api.post('/auth/login', {
                login: identifier,
                password: password,
            });

            const data = response?.data || {};
            const token = data.token || data.accessToken || null;

            const rawUser = data.user || (data.id ? data : null);
            let user = null;
            if (rawUser) {
                const { token, refreshToken, accessToken: a, ...rest } = rawUser;
                user = rest;
            }

            if (token) setAccessToken(token);
            if (user) setUser(user);

            console.log('Logged in — token set:', !!token, 'user set:', !!user);
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    };

    return { login };
};

export default useAuthStore;

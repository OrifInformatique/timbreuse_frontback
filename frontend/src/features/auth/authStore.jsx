import { create } from 'zustand';
import { persist } from 'zustand/middleware';

try {
    const key = 'auth-storage';
    const raw = localStorage.getItem(key);
    if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.state) {
            // remove top-level accessToken if present
            if (parsed.state.accessToken) {
                delete parsed.state.accessToken;
            }
            // remove token/refreshToken if accidentally stored inside user
            if (parsed.state.user && parsed.state.user.token) {
                delete parsed.state.user.token;
            }
            if (parsed.state.user && parsed.state.user.refreshToken) {
                delete parsed.state.user.refreshToken;
            }
            localStorage.setItem(key, JSON.stringify(parsed));
        }
    }
} catch (e) {
}

const useAuthStore = create(
    persist(
        (set, get) => ({
            accessToken: null,
            setAccessToken: (token) => set({ accessToken: token }),
            clearAccessToken: () => set({ accessToken: null }),

            user: null,
            setUser: (user) => {
                if (!user) return set({ user: null });
                const { token, refreshToken, accessToken, ...rest } = user || {};
                return set({ user: rest });
            },
            clearUser: () => set({ user: null }),

            hasRole: (role) => {
                const user = get().user;
                if (!user) return false;
                if (user.mainRole === role) return true;
                const roles = user.roles || [];
                return roles.includes(role);
            },
            hasPermission: (perm) => {
                const user = get().user;
                if (!user) return false;
                const permissions = user.permissions || [];
                return permissions.includes(perm);
            },

            clearAuth: () => set({ accessToken: null, user: null }),
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
            partialize: (state) => {
                const u = state.user || null;
                if (!u) return { user: null };
                return {
                    user: {
                        id: u.id,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        login: u.login,
                        mainRole: u.mainRole,
                        roles: u.roles || [],
                        permissions: u.permissions || [],
                    },
                };
            },
            onRehydrateStorage: () => (state) => {
                if (state) {
                    if (state.accessToken) delete state.accessToken;
                    if (state.user && state.user.token) delete state.user.token;
                    if (state.user && state.user.refreshToken) delete state.user.refreshToken;
                }
            },
        }
    )
);

export default useAuthStore;

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import {authApi} from "@/lib/api/endpoints/auth";

export interface User {
    id: string;
    email: string;
    username: string;
    roles: string[];
    permissions: string[];
}

interface AuthState {
    user: User | null;
    tokenPurpose: 'access' | 'temporary' | 'admin' | null;
    issuedAt: number | null; // For token freshness checks
}

interface AuthContextType {
    user: User | null;
    roles: string[];
    permissions: string[];
    tokenPurpose: 'access' | 'temporary' | 'admin' | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    // Role/permission helpers
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    isAdmin: boolean;
    isModerator: boolean;
    canAccessAdmin: boolean;
    // Auth methods
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

interface LoginCredentials {
    email: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom event for auth state changes
const AUTH_EVENTS = {
    LOGOUT: 'auth:logout',
    LOGIN: 'auth:login',
    TOKEN_EXPIRED: 'auth:token_expired',
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        tokenPurpose: null,
        issuedAt: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const lastAuthCheckRef = useRef<number>(0);
    const authCheckInProgressRef = useRef<boolean>(false);

    const { user, tokenPurpose } = authState;
    const isAuthenticated = !!user;
    const roles = user?.roles || [];
    const permissions = user?.permissions || [];

    // Role and permission helper functions
    const hasRole = useCallback((role: string): boolean => {
        return roles.includes(role);
    }, [roles]);

    const hasPermission = useCallback((permission: string): boolean => {
        // Admins have all permissions
        return permissions.includes(permission) || roles.includes('admin');
    }, [permissions, roles]);

    const hasAnyRole = useCallback((rolesToCheck: string[]): boolean => {
        return rolesToCheck.some(role => roles.includes(role));
    }, [roles]);

    const hasAnyPermission = useCallback((permissionsToCheck: string[]): boolean => {
        return permissionsToCheck.some(permission => hasPermission(permission));
    }, [hasPermission]);

    // Computed properties for common checks
    const isAdmin = hasRole('admin');
    const isModerator = hasRole('moderator');
    const canAccessAdmin = isAdmin && tokenPurpose === 'admin';

    // Debounced auth check - only check if it's been more than 30 seconds
    const checkAuthStatus = useCallback(async (force: boolean = false) => {
        const now = Date.now();
        const timeSinceLastCheck = now - lastAuthCheckRef.current;

        // Skip if checked recently (unless forced) or if already in progress
        if (authCheckInProgressRef.current || (!force && timeSinceLastCheck < 30000)) {
            setIsLoading(false);
            return;
        }

        authCheckInProgressRef.current = true;

        try {
            // Assuming your API returns user data with roles and token info
            const response = await authApi.me();

            setAuthState({
                user: {
                    id: response.user.id,
                    email: response.user.email,
                    username: response.user.username,
                    roles: response.user.roles || [],
                    permissions: response.user.permissions || [],
                },
                tokenPurpose: response.tokenPurpose,
                issuedAt: response.issuedAt || Date.now(),
            });

            lastAuthCheckRef.current = now;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            if (errorMessage.includes('401')) {
                setAuthState({ user: null, tokenPurpose: null, issuedAt: null });
                window.dispatchEvent(new CustomEvent(AUTH_EVENTS.TOKEN_EXPIRED));
            } else {
                setAuthState({ user: null, tokenPurpose: null, issuedAt: null });
                console.error('Auth check failed:', error);
            }
        } finally {
            setIsLoading(false);
            authCheckInProgressRef.current = false;
        }
    }, []);

    // Debounced user activity handler
    const debouncedActivityCheck = useCallback(() => {
        if (!isAuthenticated) return;

        // Use a timeout to debounce rapid user interactions
        const timeoutId = setTimeout(() => {
            checkAuthStatus();
        }, 1000); // 1 second debounce

        return () => clearTimeout(timeoutId);
    }, [checkAuthStatus, isAuthenticated]);

    // Check auth on mount and set up event listeners
    useEffect(() => {
        checkAuthStatus(true); // Force initial check

        // Check auth when user returns to tab
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkAuthStatus();
            }
        };

        // Listen for custom auth events from other tabs
        const handleAuthEvent = (event: CustomEvent) => {
            if (event.type === AUTH_EVENTS.LOGOUT || event.type === AUTH_EVENTS.TOKEN_EXPIRED) {
                setAuthState({ user: null, tokenPurpose: null, issuedAt: null });
            }
        };

        // Set up event listeners once
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent as EventListener);
        window.addEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleAuthEvent as EventListener);

        // Optional: Check auth on window focus (less aggressive than click)
        window.addEventListener('focus', debouncedActivityCheck);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent as EventListener);
            window.removeEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleAuthEvent as EventListener);
            window.removeEventListener('focus', debouncedActivityCheck);
        };
    }, [checkAuthStatus, debouncedActivityCheck]);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            await authApi.login(credentials);

            const response = await authApi.me();

            setAuthState({
                user: {
                    id: response.user.id,
                    email: response.user.email,
                    username: response.user.username,
                    roles: response.user.roles || [],
                    permissions: response.user.permissions || [],
                },
                tokenPurpose: response.tokenPurpose,
                issuedAt: response.issuedAt || Date.now(),
            });

            lastAuthCheckRef.current = Date.now();

            // Notify other tabs about login
            window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN));
        } catch (error) {
            setAuthState({ user: null, tokenPurpose: null, issuedAt: null });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthState({ user: null, tokenPurpose: null, issuedAt: null });
            lastAuthCheckRef.current = 0;

            // Notify other tabs about logout
            window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
        }
    };

    const refreshAuth = async () => {
        await checkAuthStatus(true); // Force refresh
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                roles,
                permissions,
                tokenPurpose,
                isLoading,
                isAuthenticated,
                // Helper functions
                hasRole,
                hasPermission,
                hasAnyRole,
                hasAnyPermission,
                // Computed properties
                isAdmin,
                isModerator,
                canAccessAdmin,
                // Auth methods
                login,
                logout,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Additional hook for role-based component rendering
export function useRequireRole(requiredRole: string) {
    const { hasRole, isLoading } = useAuth();
    return { hasAccess: hasRole(requiredRole), isLoading };
}

// Additional hook for permission-based component rendering
export function useRequirePermission(requiredPermission: string) {
    const { hasPermission, isLoading } = useAuth();
    return { hasAccess: hasPermission(requiredPermission), isLoading };
}
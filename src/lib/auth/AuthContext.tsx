'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';

interface User {
    id: string;
    email: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

interface LoginCredentials {
    email: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3008/api/v1';

// Custom event for auth state changes
const AUTH_EVENTS = {
    LOGOUT: 'auth:logout',
    LOGIN: 'auth:login',
    TOKEN_EXPIRED: 'auth:token_expired',
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const lastAuthCheckRef = useRef<number>(0);
    const authCheckInProgressRef = useRef<boolean>(false);

    const isAuthenticated = !!user;

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
            const response = await fetch(`${BACKEND_URL}/private/auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                lastAuthCheckRef.current = now;
            } else if (response.status === 401) {
                setUser(null);
                window.dispatchEvent(new CustomEvent(AUTH_EVENTS.TOKEN_EXPIRED));
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
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
                setUser(null);
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
    }, [checkAuthStatus, debouncedActivityCheck]); // Only depend on the stable functions

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/public/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userData = await response.json();
            setUser(userData);
            lastAuthCheckRef.current = Date.now();

            // Notify other tabs about login
            window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN));
        } catch (error) {
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${BACKEND_URL}/private/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
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
                isLoading,
                isAuthenticated,
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
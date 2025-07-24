'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminUser {
    id: string;
    email: string;
    username: string;
    role?: string;
}

interface AdminAuthContextType {
    user: AdminUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: AdminLoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

interface AdminLoginCredentials {
    email: string;
    password: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3008/api/v1';

// Custom events for admin auth state changes
const ADMIN_AUTH_EVENTS = {
    LOGOUT: 'admin_auth:logout',
    LOGIN: 'admin_auth:login',
    TOKEN_EXPIRED: 'admin_auth:token_expired',
    UNAUTHORIZED: 'admin_auth:unauthorized',
} as const;

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const lastAuthCheckRef = useRef<number>(0);
    const authCheckInProgressRef = useRef<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = !!user;

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

                // Admin-specific validation
                // You can add role checking here if needed
                // if (userData.role !== 'admin') {
                //     throw new Error('Insufficient privileges');
                // }

                setUser(userData);
                lastAuthCheckRef.current = now;
            } else if (response.status === 401) {
                setUser(null);
                window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENTS.TOKEN_EXPIRED));

                // Redirect to admin login if on admin pages
                if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            } else if (response.status === 403) {
                setUser(null);
                window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENTS.UNAUTHORIZED));

                // Redirect to admin login for forbidden access
                if (pathname?.startsWith('/admin')) {
                    router.push('/admin/login');
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Admin auth check failed:', error);
            setUser(null);

            // Redirect on any auth error while on admin pages
            if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        } finally {
            setIsLoading(false);
            authCheckInProgressRef.current = false;
        }
    }, [pathname, router]);

    // Admin-focused activity monitoring
    const debouncedActivityCheck = useCallback(() => {
        if (!isAuthenticated || !pathname?.startsWith('/admin')) return;

        const timeoutId = setTimeout(() => {
            checkAuthStatus();
        }, 2000); // Slightly longer debounce for admin panel

        return () => clearTimeout(timeoutId);
    }, [checkAuthStatus, isAuthenticated, pathname]);

    // Enhanced event handling for admin context
    useEffect(() => {
        // Only run auth check if we're on admin pages or initial load
        if (pathname?.startsWith('/admin') || isLoading) {
            checkAuthStatus(true);
        } else {
            setIsLoading(false);
        }

        const handleVisibilityChange = () => {
            if (!document.hidden && pathname?.startsWith('/admin')) {
                checkAuthStatus();
            }
        };

        const handleAdminAuthEvent = (event: CustomEvent) => {
            if (event.type === ADMIN_AUTH_EVENTS.LOGOUT ||
                event.type === ADMIN_AUTH_EVENTS.TOKEN_EXPIRED ||
                event.type === ADMIN_AUTH_EVENTS.UNAUTHORIZED) {
                setUser(null);

                // Always redirect to admin login for admin auth events
                if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
        };

        // Set up event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener(ADMIN_AUTH_EVENTS.LOGOUT, handleAdminAuthEvent as EventListener);
        window.addEventListener(ADMIN_AUTH_EVENTS.TOKEN_EXPIRED, handleAdminAuthEvent as EventListener);
        window.addEventListener(ADMIN_AUTH_EVENTS.UNAUTHORIZED, handleAdminAuthEvent as EventListener);

        // Only monitor activity on admin pages
        if (pathname?.startsWith('/admin')) {
            window.addEventListener('focus', debouncedActivityCheck);
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener(ADMIN_AUTH_EVENTS.LOGOUT, handleAdminAuthEvent as EventListener);
            window.removeEventListener(ADMIN_AUTH_EVENTS.TOKEN_EXPIRED, handleAdminAuthEvent as EventListener);
            window.removeEventListener(ADMIN_AUTH_EVENTS.UNAUTHORIZED, handleAdminAuthEvent as EventListener);
            window.removeEventListener('focus', debouncedActivityCheck);
        };
    }, [checkAuthStatus, debouncedActivityCheck, pathname, router, isLoading]);

    const login = async (credentials: AdminLoginCredentials) => {
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
                const errorData = await response.text();
                throw new Error(errorData || 'Admin login failed');
            }

            const userData = await response.json();

            // Admin-specific validation after login
            // You can add role checking here if needed
            // if (userData.role !== 'admin') {
            //     throw new Error('Admin access required');
            // }

            setUser(userData);
            lastAuthCheckRef.current = Date.now();

            // Notify other tabs about admin login
            window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENTS.LOGIN));

            // Redirect to admin dashboard after successful login
            router.push('/admin');
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
            console.error('Admin logout error:', error);
        } finally {
            setUser(null);
            lastAuthCheckRef.current = 0;

            // Notify other tabs about admin logout
            window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENTS.LOGOUT));

            // Always redirect to admin login after logout
            router.push('/admin/login');
        }
    };

    const refreshAuth = async () => {
        await checkAuthStatus(true);
    };

    return (
        <AdminAuthContext.Provider
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
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}

// Optional: Hook to check if user has admin access
export function useAdminAccess() {
    const { user, isAuthenticated } = useAdminAuth();

    // You can enhance this with role-based checking
    const hasAdminAccess = isAuthenticated && !!user;
    // const hasAdminAccess = isAuthenticated && user?.role === 'admin';

    return {
        hasAdminAccess,
        user,
        isAuthenticated,
    };
}
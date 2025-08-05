import { apiClient, createFormData } from '../client';
import {User} from "@/lib/auth/AuthContext";

export interface MeResponse {
    user: User;
    tokenPurpose: 'access' | 'temporary' | 'admin' | null;
    issuedAt: number | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    message: string;
    success: boolean;
}


export const authApi = {
    me: (): Promise<MeResponse> => apiClient.get('/private/auth/me'),

    login: (credentials: LoginCredentials): Promise<AuthResponse> => apiClient.post('/public/auth/login', credentials),

    register: (data: RegisterRequest): Promise<AuthResponse> => {
        return apiClient.post('/public/auth/register', data);
    },

    logout: (): Promise<void> => apiClient.post('/private/auth/logout', {}),
}
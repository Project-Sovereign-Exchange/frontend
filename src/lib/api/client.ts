export const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3008/api/v1';

export interface RequestOptions {
    headers?: Record<string, string>;
    isMultipart?: boolean;
    credentials?: RequestCredentials;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export const apiClient = {
    async get<T>(endpoint: string, paramsOrOptions?: Record<string, any> | RequestOptions, options?: RequestOptions): Promise<ApiResponse<T>> {
        let url = `${API_BASE_URL}${endpoint}`;
        let finalOptions: RequestOptions = {};

        if (paramsOrOptions) {
            if ('credentials' in paramsOrOptions || 'headers' in paramsOrOptions) {
                finalOptions = paramsOrOptions as RequestOptions;
            } else {
                const queryString = buildQueryString(paramsOrOptions);
                if (queryString) {
                    url += `?${queryString}`;
                }
                finalOptions = options || {};
            }
        }

        const response = await fetch(url, {
            method: 'GET',
            credentials: finalOptions.credentials || 'include',
            headers: {
                'Content-Type': 'application/json',
                ...finalOptions.headers,
            },
        });

        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        return response.json();
    },

    async post<T>(endpoint: string, data: FormData | Record<string, unknown> | object, options?: RequestOptions): Promise<T> {
        const isMultipart = options?.isMultipart || data instanceof FormData;

        const requestInit: RequestInit = {
            method: 'POST',
            credentials: options?.credentials || 'include',
            headers: {
                ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
                ...options?.headers,
            },
            body: isMultipart ? data as FormData : JSON.stringify(data),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, requestInit);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        return response.json();
    },

    async put<T>(endpoint: string, data: FormData | Record<string, unknown> | object, options?: RequestOptions): Promise<T> {
        const isMultipart = options?.isMultipart || data instanceof FormData;

        const requestInit: RequestInit = {
            method: 'PUT',
            credentials: options?.credentials || 'include',
            headers: {
                ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
                ...options?.headers,
            },
            body: isMultipart ? data as FormData : JSON.stringify(data),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, requestInit);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        return response.json();
    },

    async patch<T>(endpoint: string, data: FormData | Record<string, unknown> | object, options?: RequestOptions): Promise<T> {
        const isMultipart = options?.isMultipart || data instanceof FormData;

        const requestInit: RequestInit = {
            method: 'PATCH',
            credentials: options?.credentials || 'include',
            headers: {
                ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
                ...options?.headers,
            },
            body: isMultipart ? data as FormData : JSON.stringify(data),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, requestInit);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        return response.json();
    },

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: options?.credentials || 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        return response.json();
    },
};

export const createFormData = (data: Record<string, unknown>): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (item instanceof File || item instanceof Blob) {
                    formData.append(`${key}[${index}]`, item);
                } else if (item !== null && item !== undefined) {
                    formData.append(`${key}[${index}]`, String(item));
                }
            });
        } else if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    return formData;
};

const buildQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
        }
    });

    return searchParams.toString();
};
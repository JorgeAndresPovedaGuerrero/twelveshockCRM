// src/app/models/auth.model.ts
export interface User {
    id?: string;
    username: string;
    password?: string;
    roles: string[];
    birthdate: string;
    email: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TokenResponse {
    token: string;
}

export interface ErrorResponse {
    message: string;
}

// This file exports TypeScript types and interfaces used throughout the application.

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
}

export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: Date;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
}

export type Nullable<T> = T | null;
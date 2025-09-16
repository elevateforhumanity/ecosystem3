export declare class ApiError extends Error { constructor(status: number, message: string); status: number; }
export declare function apiFetch(path: string, opts?: any): Promise<any>;

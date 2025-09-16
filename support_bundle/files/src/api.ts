/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  // Placeholder for API functionality
  get: async (url: string) => {
    throw new ApiError(500, "API not implemented");
  },
  
  post: async (url: string, data: any) => {
    throw new ApiError(500, "API not implemented");
  },
};
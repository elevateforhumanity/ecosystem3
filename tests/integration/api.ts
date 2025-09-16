// Thin TypeScript wrapper re-exporting ApiError from JS client for tests.
// This avoids rewriting existing JS implementation.
// If expanded later, migrate apiClient.js to TypeScript.
export { ApiError } from './lib/apiClient.js';

// Type definitions for framework configuration JSON
declare module '../config/framework.config.json' {
  const value: any;
  export default value;
}

// Extend window object for any global properties
declare global {
  interface Window {
    EFH_CONFIG?: any;
  }
}

export {};
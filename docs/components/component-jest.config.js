export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.js'],
  transform: {},
  testMatch: ['<rootDir>/test/**/*.test.js'],
  testPathIgnorePatterns: ['<rootDir>/.migration_temp_*/', '<rootDir>/node_modules/'],
  testTimeout: 30000,
  collectCoverage: false
};
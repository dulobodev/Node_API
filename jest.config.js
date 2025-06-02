module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__test__/**/*.test.js'],
  setupFilesAfterEnv: ['./__test__/setup.js'],
  testTimeout: 30000,
  detectOpenHandles: true
};
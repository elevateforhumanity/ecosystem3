const { defineConfig } = require('vite');

module.exports = defineConfig({
  test: {
    environment: 'node'
  },
  assetsInclude: ['**/*.cjs']
});

module.exports = {
  root: true,
  extends: ['@nuxtjs/eslint-config-typescript'],

  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // helps resolve types for js/ts files
        project: './tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: ['**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },
  ],
  rules: {
    // Overwrite or add rules here
    'vue/multi-word-component-names': 'off',
  }
}

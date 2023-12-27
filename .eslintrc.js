module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', '@typescript-eslint', 'import', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-typescript/base',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    "import/order": [
      "error",
      {
        "alphabetize": { "order": "asc", "caseInsensitive": true },
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "pathGroups": [
          { "pattern": "@nestjs/**", "group": "external", "position": "before" },
          { "pattern": "@src/**", "group": "internal", "position": "before" },
          { "pattern": "@modules/**", "group": "internal", "position": "before" },
          { "pattern": "@test/**", "group": "internal", "position": "before" }
        ],
        "newlines-between": "always"
      }
    ],
  },
};

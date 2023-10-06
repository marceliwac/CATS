module.exports = {
  backend: {
    extends: ['airbnb', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
      ecmaVersion: 2020,
    },
    ignorePatterns: [
      'node_modules/',
      'build/',
      'public/',
      'amplify/',
      '.yarn-cache',
    ],
    rules: {
      'no-underscore-dangle': ['error', { allow: ['_operations'] }],
      'prettier/prettier': ['error'],
      'global-require': ['off'],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
    },
  },
  frontend: {
    env: {
      browser: true,
      es6: true,
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    plugins: ['react', 'prettier', 'react-hooks'],
    ignorePatterns: ['node_modules/', 'build/', 'dist/', 'public/', '.npm'],
    rules: {
      'prettier/prettier': 'error',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-curly-newline': 'off', // Disabled due to conflict with prettier
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',
      'prefer-destructuring': 'off',
      'import/no-cycle': ['error', { maxDepth: Infinity }], // incompatibility with airbnb config
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-param-reassign': 'off',
      'no-mixed-operators': 'off',
      camelcase: 'off',
    },
  },
};

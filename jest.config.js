module.exports = {
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'tsx'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/*.test.ts'],
    testEnvironment: 'node'
  };
  
module.exports = {
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'tsx'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/website/src/$1',
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/*.test.tsx'],
    testEnvironment: 'jsdom'
  };
  
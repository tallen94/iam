module.exports = {
	rootDir: 'tests',
	globals: {
		'ts-jest': {
			tsConfigFile: '../tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/*.test.(ts|js)'
	],
	testEnvironment: 'node'
};
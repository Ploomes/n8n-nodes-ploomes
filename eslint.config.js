const n8nNodesBase = require('eslint-plugin-n8n-nodes-base');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
	{
		ignores: ['dist/**', 'node_modules/**', 'gulpfile.js'],
	},
	{
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			...n8nNodesBase.configs.community.rules,
			'n8n-nodes-base/community-package-json-name-still-default': 'off',
		},
	},
];

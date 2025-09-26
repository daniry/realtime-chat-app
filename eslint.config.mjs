import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
	...compat.config({
		extends: [
			'next',
			'eslint:recommended',
			'next/core-web-vitals',
			'next/typescript',
			'plugin:@typescript-eslint/recommended',
			'plugin:prettier/recommended',
			'plugin:react/recommended',
			'plugin:react/jsx-runtime',
			'prettier',
		],
		rules: {
			'no-unused-vars': ['warn'],
			'no-console': ['warn'],
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'react/jsx-max-props-per-line': [1, { when: 'multiline' }],
			'@typescript-eslint/no-explicit-any': ['warn'],
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'react/prop-types': 'off',
		},
		plugins: ['prettier'],
		settings: {},
	}),
];

export default eslintConfig;

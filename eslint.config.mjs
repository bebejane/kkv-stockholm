import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'types/datocms.ts',
			'types/datocms.cda.ts',
			'graphql/index.ts',
			'db/migrations/**',
		],
	},
	...nextCoreWebVitals,
	{
		rules: {
			// React Compiler advisories — useful but not correctness errors.
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/preserve-manual-memoization': 'warn',
			'react-hooks/refs': 'warn',
		},
	},
];

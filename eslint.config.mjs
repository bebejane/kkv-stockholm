import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'legacy/**',
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
			// `eslint-config-next` treats any component named `Image` as `<img>`,
			// but this project uses react-datocms' `Image`, which renders
			// `alt={data.alt}` itself and has no `alt` prop. Only check native
			// `<img>` (the few raw ones carry scoped disables).
			'jsx-a11y/alt-text': ['warn', { elements: ['img'], img: [] }],
		},
	},
];

export default config;

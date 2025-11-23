import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	sassOptions: {
		includePaths: ['./components', './app'],
		prependData: `
			@use "sass:math";			
    	@use "@/styles/mediaqueries" as *;
  	`,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack: (config) => {
		config.module.exprContextCritical = false;
		config.resolve.alias['datocms.config'] = path.join(__dirname, 'datocms.config.ts');
		return config;
	},
	turbopack: {
		resolveAlias: {
			'datocms.config': './datocms.config.ts',
		},
	},
	devIndicators: false,
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	async headers() {
		return [
			{
				source: '/api/web-previews',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{ key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
			{
				source: '/api/backup',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
					{ key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
		];
	},
};

export default nextConfig;

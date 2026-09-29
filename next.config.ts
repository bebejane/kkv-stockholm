import 'dotenv/config';
import { NextConfig } from 'next';
import path from 'path';

// Full origins (scheme + host) for the CSP frame-ancestors directive.
const originUrls = [
	'https://plugins-cdn.datocms.com',
	'https://assets.admin.datocms.com',
	'https://dashboard.datocms.com',
	process.env.NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL,
	process.env.NEXT_PUBLIC_SITE_URL,
].filter((origin): origin is string => Boolean(origin));

// `allowedDevOrigins` compares bare hostnames, not full URLs.
const allowedDevOriginHosts = originUrls.map((origin) => new URL(origin).hostname);

const nextConfig: NextConfig = {
	sassOptions: {
		includePaths: ['./components', './app'],
		prependData: `
			@use "sass:math";			
    	@use "@/styles/mediaqueries" as *;
  	`,
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
	logging: false,
	experimental: {
		prefetchInlining: true,
	},
	allowedDevOrigins: allowedDevOriginHosts,
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: `frame-ancestors 'self' ${originUrls.join(' ')}`,
					},
				],
			},
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
					{ key: 'Access-Control-Allow-Origin', value: '*' },
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

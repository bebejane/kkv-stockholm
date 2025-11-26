import { apiQuery } from 'next-dato-utils/api';
import { SitemapDocument, GlobalDocument } from '@/graphql';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';

export default {
	routes: {
		start: async () => [`/`],
		sign_up_start: async () => [`/bli-medlem`],
		in_english: async () => [`/in-english`],
		contact: async () => [`/kontakt`],
		footer: async () => [`/`],
		course: async ({ id, slug }) => [`/kurser/${slug}`, '/kurser', ...(await getItemReferenceRoutes(id))],
		equipment: async ({ id, slug }) => [`/verkstader/${slug}`, '/verkstader', ...(await getItemReferenceRoutes(id))],
		workshop: async ({ id, slug }) => [`/verkstader/${slug}`, '/verkstader', ...(await getItemReferenceRoutes(id))],
		workshops_start: async () => [`/verkstader`],
		about: async ({ id, slug }) => [`/om-oss/${slug}`, '/om-oss', ...(await getItemReferenceRoutes(id))],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async () => {
		const { allAbouts, allWorkshops, allCourses } = await apiQuery(SitemapDocument, {
			all: true,
			includeDrafts: false,
		});
		const staticRoutes = ['/', '/kontakt', '/in-english', '/bli-medlem', '/logga-in'].map((p) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${p}`,
			lastModified: new Date().toISOString(),
			changeFrequency: p === '/' ? 'daily' : 'weekly',
			priority: p === '/' ? 1 : 0.8,
		}));

		const aboutRoutes = allAbouts
			.map(({ slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/om-oss/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
			}))
			.concat({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/om-oss`,
				lastModified: new Date(allAbouts.find(({ slug }) => slug === 'om-oss')?._updatedAt).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
			});

		const allWorkshopRoutes = allWorkshops
			.map(({ slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/verkstader/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
			}))
			.concat({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/verkstader`,
				lastModified: new Date(
					allWorkshops.sort((a, b) => b._updatedAt.localeCompare(a._updatedAt))[0]?._updatedAt
				).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
			});

		const allCourseRoutes = allCourses
			.map(({ slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurser/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
			}))
			.concat({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurser`,
				lastModified: new Date(
					allCourses.sort((a, b) => b._updatedAt.localeCompare(a._updatedAt))[0]?._updatedAt
				).toISOString(),
				changeFrequency: 'monthly',
				priority: 0.8,
			});

		return [...staticRoutes, ...aboutRoutes, ...allWorkshopRoutes, ...allCourseRoutes] as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		const { site } = await apiQuery(GlobalDocument);

		return {
			name: site.globalSeo?.fallbackSeo?.title as string,
			short_name: site.globalSeo?.fallbackSeo?.title as string,
			description: site.globalSeo?.fallbackSeo?.description as string,
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
				disallow: ['/api', '/medlem'],
			},
		};
	},
} satisfies DatoCmsConfig;

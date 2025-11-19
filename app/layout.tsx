import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@/styles/index.scss';
import s from './layout.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { FooterDocument, GlobalDocument } from '@/graphql';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { theme } from '@/lib/mantine';
import { buildMenu, authMenu } from '@/lib/menu';
import { Menu } from '@/components/nav/Menu';
import { Footer } from '@/components/nav/Footer';

export default async function RootLayout({ children }: LayoutProps<'/'>) {
	const menu = await buildMenu();
	const { footer } = await apiQuery(FooterDocument, { tags: ['footer'] });

	return (
		<>
			<html lang='sv-SE' {...mantineHtmlProps}>
				<head>
					<ColorSchemeScript />
				</head>
				<body id='root'>
					<MantineProvider theme={theme}>
						<Menu menu={menu} authMenu={authMenu} />
						<NuqsAdapter>
							<main className={s.main}>{children}</main>
						</NuqsAdapter>
					</MantineProvider>
					<Footer footer={footer} />
				</body>
			</html>
		</>
	);
}

export async function generateMetadata({ params }: LayoutProps<'/'>): Promise<Metadata> {
	const {
		site: { globalSeo, faviconMetaTags },
	} = await apiQuery(GlobalDocument, {
		revalidate: 60 * 60,
	});

	const siteName = globalSeo?.siteName ?? '';
	const pathname = new URL(process.env.NEXT_PUBLIC_SITE_URL as string).pathname;
	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		...(await buildMetadata({
			title: {
				template: `${siteName} — %s`,
				default: siteName ?? '',
			},
			description: globalSeo?.fallbackSeo?.description?.substring(0, 157),
			pathname,
			image: globalSeo?.fallbackSeo?.image as FileField,
			locale: 'sv-SE' as SiteLocale,
		})),
	};
}

export type BuildMetadataProps = {
	title?: string | any;
	description?: string | null | undefined;
	pathname?: string;
	image?: FileField | null | undefined;
	locale?: string;
};

export async function buildMetadata({
	title,
	description,
	pathname,
	image,
	locale,
}: BuildMetadataProps): Promise<Metadata> {
	description = !description ? '' : description.length > 160 ? `${description.substring(0, 157)}...` : description;
	const url = pathname ? `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}` : undefined;

	return {
		title,
		alternates: {
			canonical: url,
		},
		description,
		openGraph: {
			title,
			description,
			url,
			images: image
				? [
						{
							url: `${image?.url}?w=1200&h=630&fit=fill&q=80`,
							width: 800,
							height: 600,
							alt: title,
						},
						{
							url: `${image?.url}?w=1600&h=800&fit=fill&q=80`,
							width: 1600,
							height: 800,
							alt: title,
						},
						{
							url: `${image?.url}?w=790&h=627&fit=crop&q=80`,
							width: 790,
							height: 627,
							alt: title,
						},
					]
				: undefined,
			locale: locale ?? 'sv_SE',
			type: 'website',
		},
	};
}

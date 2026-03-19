import { AllAboutsDocument } from '@/graphql';
import { Route } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { stripStega } from '@datocms/content-link';

export type MenuItem = {
	id:
	| 'about'
	| `about-${string}`
	| 'workshops'
	| 'courses'
	| 'signup'
	| 'contact'
	| 'in-english'
	| 'member'
	| `member-${string}`;
	title: string;
	slug?: Route;
	auth?: boolean;
	split?: boolean;
	sub?: MenuItem[];
	pathnames?: string[];
	parent?: MenuItem['id'];
};

export type Menu = MenuItem[];

export const buildMenu = async (): Promise<Menu> => {
	const { allAbouts } = await apiQuery(AllAboutsDocument, { all: true });

	const menu: Menu = [
		{
			id: 'about',
			title: 'Om oss',
			sub: allAbouts.map(({ title, slug }) => ({
				id: `about-${slug}`,
				title,
				slug: slug === 'om-oss' ? '/om-oss' : (`/om-oss/${slug}` as Route),
				parent: 'about',
			})),
		},
		{
			id: 'workshops',
			title: 'Verkstäder',
			slug: '/verkstader',
		},
		{
			id: 'courses',
			title: 'Kurser',
			slug: '/kurser',
		},
		{
			id: 'signup',
			title: 'Bli medlem',
			slug: '/bli-medlem',
		},
		{
			id: 'contact',
			title: 'Kontakt',
			slug: '/kontakt',
			split: true,
		},
		{
			id: 'in-english',
			title: 'In English',
			slug: '/in-english',
			pathnames: ['/'],
		},
		{
			id: 'member',
			title: 'Mina sidor',
			slug: '/logga-in',
			auth: false,
		},
	];

	return stripStega(menu);
};

export const authMenu: MenuItem[] = [
	{
		id: 'member-bookings',
		title: 'Bokningar',
		slug: '/medlem/bokningar',
		auth: true,
	},
	{
		id: 'member-reports',
		title: 'Rapporter',
		slug: '/medlem/rapporter',
		auth: true,
	},
	// {
	// 	id: 'member-courses',
	// 	title: 'Kurser',
	// 	slug: '/medlem/kurser',
	// 	auth: true,
	// },
	{
		id: 'member-profile',
		title: 'Profil',
		slug: '/medlem/profil',
		auth: true,
	},
	{
		id: 'member-logout',
		title: 'Logga ut',
		slug: '/medlem/logga-ut',
		auth: true,
	},
];

export const findMenuItem = (menu: Menu, pathname: string): MenuItem | null => {
	return (
		menu
			.map((item) => [item, ...(item.sub ?? [])])
			.flat()
			.find(({ slug }) => pathname === slug) ?? null
	);
};

export const findActiveMenuItem = (menu: Menu, pathname: string): MenuItem | null => {
	let item =
		findMenuItem(menu, pathname) ?? menu.find(({ slug }) => slug && pathname.startsWith(slug));
	return item ?? null;
};

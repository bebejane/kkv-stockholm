import { AllAboutsDocument } from '@/graphql';
import { Route } from 'next';
import { apiQuery } from 'next-dato-utils/api';

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
};

export type Menu = MenuItem[];

export const buildMenu = async (): Promise<Menu> => {
	const { allAbouts } = await apiQuery(AllAboutsDocument, { all: true });

	const menu: Menu = [
		{
			id: 'about',
			title: 'Om oss',
			slug: '/om-oss',
			sub: allAbouts.map(({ title, slug }) => ({
				id: `about-${slug}`,
				title,
				slug: slug === 'om-oss' ? '/om-oss' : (`/om-oss/${slug}` as Route),
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
			title: 'Logga in',
			slug: '/logga-in',
			auth: false,
		},
	];

	return menu;
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

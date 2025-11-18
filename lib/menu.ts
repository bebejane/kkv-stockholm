import { AllAboutsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
//import { MenuDocument } from '@graphql';

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
	slug: string;
	sub?: MenuItem[];
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
				slug: `/om-oss/${slug}`,
			})),
		},
		{
			id: 'workshops',
			title: 'Verstäder',
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
		},
		{
			id: 'in-english',
			title: 'In English',
			slug: '/in-english',
		},
		{
			id: 'member',
			title: 'Logga in',
			slug: '/logga-in',
			/*sub: [
				{
					id: 'member-bookings',
					title: 'Bokningar',
					slug: '/medlem/bokningar',
				},
				{
					id: 'member-reports',
					title: 'Rapporter',
					slug: '/medlem/rapporter',
				},
				{
					id: 'member-profile',
					title: 'Profil',
					slug: '/medlem/profil',
				},
				{
					id: 'member-logout',
					title: 'Logga ut',
					slug: '/medlem/logga-ut',
				},
			],
			*/
		},
	];
	console.log(menu);
	return menu;
};

export const findMenuItem = (menu: Menu, pathname: string): MenuItem | null => {
	return (
		menu
			.map((item) => [item, ...(item.sub ?? [])])
			.flat()
			.find(({ slug }) => pathname === slug) ?? null
	);
};

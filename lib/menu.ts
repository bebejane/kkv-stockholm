import { AllAboutsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
//import { MenuDocument } from '@graphql';

export type MenuItem = {
	id: 'about' | 'workshops' | 'courses' | 'signup' | 'contact' | 'in-english' | 'member';
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
				id: 'about',
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
			title: 'Login',
			slug: '/logga-in',
			sub: [
				{
					id: 'member',
					title: 'Bokningar',
					slug: '/medlem/bokningar',
				},
				{
					id: 'member',
					title: 'Rapporter',
					slug: '/medlem/rapporter',
				},
				{
					id: 'member',
					title: 'Profil',
					slug: '/medlem/profil',
				},
				{
					id: 'member',
					title: 'Logga ut',
					slug: '/medlem/logga-ut',
				},
			],
		},
	];
	return menu;
};

export const getSelectedMenuItem = (menu: Menu, pathname: string, qs: string): MenuItem | null => {
	const fullPath = `${pathname}${qs ? `?${qs.toString()}` : ''}`;
	const selectedSubFromPathname = menu
		.map(({ sub }) => sub ?? [])
		.flat()
		.find(({ slug }) => fullPath === slug)?.id;
	return menu.find(({ sub }) => sub?.find(({ id }) => id === selectedSubFromPathname)) ?? null;
};

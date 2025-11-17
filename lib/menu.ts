import { apiQuery } from 'next-dato-utils/api';
//import { MenuDocument } from '@graphql';

export type MenuItem = {
  id: string,
  title: string,
  slug?: string,
  href?: string,
  sub?: MenuItem[],
  hideInDesktop?: boolean,
  hideSub?: boolean
}

export type Menu = MenuItem[]

export const buildMenu = async (): Promise<Menu> => {

  const menu: Menu = [{
    id: 'about',
    title: 'Om',
    slug: '/om',
    sub: [],
  }, {
    id: 'news',
    title: 'Aktuellt',
    slug: '/aktuellt',
  }, {
    id: 'contact',
    title: 'Kontakt',
    slug: '/kontakt',
    sub: [
      { id: 'contact-us', title: 'Kontakta oss', slug: '/kontakt' },
      { id: 'instagram', title: 'Instagram', href: 'https://www.instagram.com/pointofyou.se' },
    ]
  }, {
    id: 'login',
    title: 'Logga In',
    slug: '/logga-in',
  }]
  return menu
}

export const getSelectedMenuItem = (menu: Menu, pathname: string, qs: string): MenuItem | null => {
  const fullPath = `${pathname}${qs ? `?${qs.toString()}` : ""}`;
  const selectedSubFromPathname = menu
    .map(({ sub }) => sub ?? [])
    .flat()
    .find(({ slug }) => fullPath === slug)?.id;
  return menu.find(({ sub }) => sub?.find(({ id }) => id === selectedSubFromPathname)) ?? null;
}
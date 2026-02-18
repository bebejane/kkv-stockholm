'use client';

import s from './Menu.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { findActiveMenuItem, findMenuItem, MenuItem } from '@/lib/menu';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/auth/auth-client';
import { Squash as Hamburger } from 'hamburger-react';
import useIsDesktop from '@/lib/hooks/useIsDesktop';

type MenuProps = {
	menu: MenuItem[];
	authMenu: MenuItem[];
};

export function Menu({ menu: _menu, authMenu }: MenuProps) {
	const pathname = usePathname();
	const [menu, setMenu] = useState<MenuItem[]>(_menu);
	const selected = findActiveMenuItem(menu, pathname);
	const { data: session, isRefetching, isPending } = authClient.useSession();
	const [active, setActive] = useState<MenuItem['id'] | null>(null);
	const [showMenu, setShowMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [subMenu, setSubMenu] = useState<string | null>(null);
	const isDesktop = useIsDesktop();

	function handleMouse(e: React.MouseEvent<HTMLElement>) {
		const target = e.currentTarget as HTMLLIElement;
		const id = target.dataset.id;
		if (e.type === 'mouseenter') setActive(() => menu.find((item) => item.id === id)?.id ?? null);
		else if (e.type === 'mouseleave') setActive(null);
	}

	function handleMobileSubClick(e: React.MouseEvent<HTMLElement>) {
		if (isDesktop) return;
		const target = e.currentTarget as HTMLLIElement;
		const id = target.dataset.id as MenuItem['id'];
		setActive(active === id ? null : (id ?? null));
	}

	useEffect(() => {
		function handleDocumentMouseLeave() {
			setActive(null);
		}

		document.addEventListener('mouseleave', handleDocumentMouseLeave);
		return () => document.removeEventListener('mouseleave', handleDocumentMouseLeave);
	}, [active]);

	useEffect(() => {
		setActive(null);
		setShowMobileMenu(false);
	}, [pathname]);

	useEffect(() => {
		setShowMenu(!isPending);

		if (isPending || isRefetching || !pathname) return;

		const m = [..._menu, ...authMenu]
			.filter(({ auth }) => (session?.user?.id ? auth !== false : auth !== true))
			.filter(({ pathnames }) => !pathnames || pathnames.includes(pathname));

		setMenu(m);
	}, [isPending, isRefetching, session, pathname, _menu, authMenu]);

	return (
		<>
			<Link href='/' className={s.wrapper}>
				<img src='/images/logo.svg' alt='logo' className={cn(s.logo, showMobileMenu && s.open)} />
				<div className={s.back}></div>
			</Link>

			<button
				className={s.hamburger}
				aria-label='Menu'
				aria-expanded={showMobileMenu}
				onClick={() => setShowMobileMenu(!showMobileMenu)}
			>
				<Hamburger
					toggled={showMobileMenu}
					toggle={setShowMobileMenu}
					size={32}
					color={showMobileMenu ? '#fcfcfc' : '#161616'}
				/>
			</button>

			<nav id='menu' className={cn(s.menu, showMobileMenu && s.show)}>
				<div className={s.wrapper}>
					<ul>
						{menu.map(({ id, title, slug, sub, split }) => (
							<li
								key={id}
								data-id={id}
								onMouseEnter={handleMouse}
								className={cn(
									split && s.split,
									active === id && s.active,
									(selected?.id === id || sub?.find(({ id: subId }) => selected?.id === subId)) &&
										s.selected,
								)}
							>
								{slug && !sub ? (
									<Link href={slug}>{title}</Link>
								) : (
									<span
										data-id={id}
										onClick={handleMobileSubClick}
										role='switch'
										aria-checked={active === id}
									>
										{title}
									</span>
								)}
								{active !== null && active === id && sub && (
									<ul
										className={s.sub}
										data-id={id}
										onMouseEnter={handleMouse}
										onMouseLeave={handleMouse}
									>
										{sub.map(({ id: subId, title, slug }) => (
											<li key={subId} className={cn(selected?.id === subId && s.selected)}>
												{slug && <Link href={slug}>{title}</Link>}
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</div>
			</nav>
		</>
	);
}

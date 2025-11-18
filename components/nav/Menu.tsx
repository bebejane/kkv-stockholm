'use client';

import s from './Menu.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { findMenuItem, MenuItem } from '@/lib/menu';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/auth/auth-client';

type MenuProps = {
	menu: MenuItem[];
	authMenu: MenuItem[];
};

export function Menu({ menu: _menu, authMenu }: MenuProps) {
	const pathname = usePathname();
	const [menu, setMenu] = useState<MenuItem[]>(_menu);
	const selected = findMenuItem(menu, pathname);
	const { data: session, isRefetching, isPending } = authClient.useSession();
	const [active, setActive] = useState<MenuItem['id'] | null>(null);

	function handleMouse(e: React.MouseEvent<HTMLElement>) {
		const target = e.currentTarget as HTMLLIElement;
		const id = target.dataset.id;
		if (e.type === 'mouseenter') setActive(() => menu.find((item) => item.id === id)?.id ?? null);
		else if (e.type === 'mouseleave') setActive(null);
	}

	useEffect(() => {
		setActive(null);
	}, [pathname]);

	useEffect(() => {
		if (isPending || isRefetching || !pathname) return;

		const m = [..._menu, ...authMenu]
			.filter(({ auth }) => (session?.user?.id ? auth !== false : auth !== true))
			.filter(({ pathnames }) => !pathnames || pathnames.includes(pathname));

		setMenu(m);
	}, [isPending, isRefetching, session, pathname, _menu, authMenu]);

	return (
		<>
			<Link href='/'>
				<img src='/images/logo.svg' alt='logo' className={s.logo} />
			</Link>
			<nav id='menu' className={s.menu}>
				<div className={s.wrapper}>
					<ul>
						{menu.map(({ id, title, slug, sub, split }) => (
							<li
								className={cn(
									split && s.split,
									active === id && s.active,
									(selected?.id === id || sub?.find(({ id: subId }) => selected?.id === subId)) && s.selected
								)}
								key={id}
								data-id={id}
								onMouseEnter={handleMouse}
							>
								{slug ? <Link href={slug}>{title}</Link> : <span>{title}</span>}
								{active !== null && active === id && sub && (
									<ul className={s.sub} data-id={id} onMouseEnter={handleMouse} onMouseLeave={handleMouse}>
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

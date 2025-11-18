'use client';

import s from './Menu.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { findMenuItem, MenuItem } from '@/lib/menu';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type MenuProps = {
	menu: MenuItem[];
};

export function Menu({ menu }: MenuProps) {
	const pathname = usePathname();
	const selected = findMenuItem(menu, pathname);
	const [active, setActive] = useState<MenuItem['id'] | null>(null);

	function handleMouse(e: React.MouseEvent<HTMLLIElement>) {
		const target = e.currentTarget as HTMLLIElement;
		const id = target.dataset.id;
		if (e.type === 'mouseenter') setActive(() => menu.find((item) => item.id === id)?.id ?? null);
		else if (e.type === 'mouseleave') setActive(null);
	}

	useEffect(() => {
		setActive(null);
	}, [pathname]);

	return (
		<>
			<Link href='/'>
				<img src='/images/logo.svg' alt='logo' className={s.logo} />
			</Link>
			<nav id='menu' className={s.menu}>
				<ul>
					{menu.map(({ id, title, slug, sub }) => (
						<li
							className={cn(
								active === id && s.active,
								(selected?.id === id || sub?.find(({ id: subId }) => selected?.id === subId)) && s.selected
							)}
							key={id}
							data-id={id}
							onMouseEnter={handleMouse}
							onMouseLeave={handleMouse}
						>
							<Link href={slug}>{title}</Link>
							{active !== null && active === id && sub && (
								<ul className={s.sub}>
									{sub.map(({ id: subId, title, slug }) => (
										<li key={subId} className={cn(selected?.id === subId && s.selected)}>
											<Link href={slug}>{title}</Link>
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

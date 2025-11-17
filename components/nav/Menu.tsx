import s from './Menu.module.scss';
import Link from 'next/link';
import { Menu as MenuType } from '@/lib/menu';

type MenuProps = {
	menu: MenuType;
};

export function Menu({ menu }: MenuProps) {
	return (
		<nav id='menu' className={s.menu}>
			<ul>
				{menu.map(({ id, title, slug, sub }) => {
					return (
						<li key={id}>
							<Link href={slug}>{title}</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

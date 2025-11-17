'use client';

import s from './LocaleSwitcher.module.scss';
import { useLocale } from 'next-intl';
import { Link, locales } from '@/i18n/routing';

export function LocaleSwitcher() {
	const locale = useLocale();

	return (
		<nav className={s.locales} key={locale}>
			<ul>
				{locales.map((l, i) => (
					<li key={i} className={locale === l ? s.selected : undefined}>
						<Link href={'/'} locale={l}>
							{l}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

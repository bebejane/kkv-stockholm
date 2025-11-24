'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Loading({ title: _title }: { title: string }) {
	const interval = useRef<ReturnType<typeof setInterval> | null>(null);
	const [dots, setDots] = useState(0);
	const pathname = usePathname();

	useEffect(() => {
		interval.current = setInterval(() => {
			setDots((d) => (d + 1 > 3 ? 0 : d + 1));
		}, 100);

		return () => {
			interval.current && clearInterval(interval.current);
		};
	}, []);

	const title = _title || getTitle(pathname);

	return (
		<article>
			<h1 key={pathname}>
				{title}
				{new Array(dots).fill('.').join('')}
			</h1>
		</article>
	);
}

function getTitle(pathname: string): string {
	const titles = {
		'/medlem': 'Bokningar',
		'/medlem/bokningar': 'Bokningar',
		'/medlem/bokningar/ny': 'Ny bokning',
		'/medlem/kurser': 'Dina kurser',
		'/medlem/rapporter': 'Rapportera tid & kostnader',
		'/medlem/kurser/ny': 'Ny kurs',
		'/medlem/rapporter/ny': 'Ny Rapport',
		'/medlem/profil': 'Profil',
		'/medlem/logga-ut': 'Loggar ut',
	};

	let t = pathname in titles ? titles[pathname as keyof typeof titles] : null;

	if (!t && pathname.startsWith('/medlem/bokningar/') && pathname.endsWith('/rapportera')) t = 'Rapportera bokning';
	if (!t && pathname.startsWith('/medlem/rapporter/')) t = 'Rapportera tid från bokning';
	if (!t && pathname.startsWith('/medlem/kurser/')) t = 'Kurs';

	return t || '';
}

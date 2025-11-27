'use client';

import DotLoader from '@/components/common/DotLoader';
import { usePathname } from 'next/navigation';

export default function Loading({ title: _title }: { title: string }) {
	const pathname = usePathname();
	const title = _title || getTitle(pathname);

	return (
		<article>
			<h1 key={pathname}>
				<DotLoader message={title} />
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
		'/medlem/kurser/ny': 'Ny kurs',
		'/medlem/rapporter': 'Rapportera tid & kostnader',
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

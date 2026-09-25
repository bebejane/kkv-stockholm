'use client';

import DotLoader from '@/components/common/DotLoader';
import { useEffect } from 'react';

export default function PageLoading({ title }: { title: string }) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [title]);

	return (
		<article>
			<h1 key={title}>
				<DotLoader message={title} />
			</h1>
		</article>
	);
}
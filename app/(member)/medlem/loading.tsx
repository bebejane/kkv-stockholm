'use client';
import { useEffect, useRef, useState } from 'react';

export default function Loading({ title }: { title: string }) {
	const interval = useRef<ReturnType<typeof setInterval> | null>(null);
	const [dots, setDots] = useState(0);
	useEffect(() => {
		interval.current = setInterval(() => {
			setDots((d) => (d + 1 > 3 ? 0 : d + 1));
		}, 100);
		return () => {
			interval.current && clearInterval(interval.current);
		};
	}, []);

	return (
		<article>
			<h1>
				{title}
				{new Array(dots).fill('.').join('')}
			</h1>
		</article>
	);
}

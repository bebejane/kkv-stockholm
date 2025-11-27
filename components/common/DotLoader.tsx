'use client';

import { useEffect, useRef, useState } from 'react';

export default function DotLoader({
	dots: _dots = 3,
	speed = 200,
	message,
}: {
	dots?: number;
	speed?: number;
	message?: string;
}) {
	const interval = useRef<ReturnType<typeof setInterval> | null>(null);
	const [dots, setDots] = useState(0);

	useEffect(() => {
		interval.current = setInterval(() => {
			setDots((d) => (d + 1 > _dots ? 0 : d + 1));
		}, speed);

		return () => {
			interval.current && clearInterval(interval.current);
		};
	}, []);

	return (
		<>
			{message && <>{message}</>}
			{new Array(_dots).fill('.').map((_, i) => (
				<span key={i} style={{ opacity: dots > i ? 1 : 0 }}>
					.
				</span>
			))}
		</>
	);
}

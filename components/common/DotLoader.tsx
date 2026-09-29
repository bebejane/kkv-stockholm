'use client';

import { useEffect, useRef, useState } from 'react';

export default function DotLoader({
	dots: _dots = 3,
	dot = '.',
	speed = 200,
	message,
	className,
}: {
	dots?: number;
	speed?: number;
	message?: string;
	className?: string;
	dot?: string;
}) {
	const interval = useRef<ReturnType<typeof setInterval> | null>(null);
	const [dots, setDots] = useState(0);
	// Keep the latest `_dots` readable inside the interval without making the
	// interval re-subscribe (which would reset the animation).
	const dotsCount = useRef(_dots);
	useEffect(() => {
		dotsCount.current = _dots;
	}, [_dots]);

	useEffect(() => {
		interval.current = setInterval(() => {
			setDots((d) => (d + 1 > dotsCount.current ? 0 : d + 1));
		}, speed);

		return () => {
			interval.current && clearInterval(interval.current);
		};
	}, [speed]);

	return (
		<>
			{message && <>{message}</>}
			{new Array(_dots).fill('.').map((_, i) => (
				<span key={i} className={className} style={{ opacity: dots > i ? 1 : 0 }}>
					{dot}
				</span>
			))}
		</>
	);
}

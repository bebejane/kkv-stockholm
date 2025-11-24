'use client';
import { useEffect } from 'react';
import test from './use-session';

export default function Page() {
	useEffect(() => {
		test()
			.then((session) => console.log(session))
			.catch((e) => console.error(e));
	}, []);

	return <div>Test</div>;
}

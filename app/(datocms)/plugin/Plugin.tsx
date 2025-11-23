'use client';

import { connect } from 'datocms-plugin-sdk';
import { useEffect } from 'react';

export function Plugin() {
	useEffect(() => {
		console.log('connect plugin');

		connect({
			renderConfigScreen(ctx) {
				return undefined;
			},
			buildItemPresentationInfo(item, ctx) {
				console.log(item, ctx);
				return undefined;
			},
		})
			.then((res) => {
				console.log('connected plugin');
				console.log(res);
			})
			.catch((err) => {
				console.log('error plugin');
				console.error(err);
			});
	}, []);

	return null;
}

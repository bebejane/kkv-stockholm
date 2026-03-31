'use client';

import { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
	ctx: RenderPageCtx;
	src: string;
};

export function IFrame({ ctx, src }: PropTypes) {
	return (
		<Canvas ctx={ctx}>
			<iframe
				src={src}
				height={'100%'}
				width={'100%'}
				style={{ border: 'none', height: '100vh' }}
			/>
		</Canvas>
	);
}

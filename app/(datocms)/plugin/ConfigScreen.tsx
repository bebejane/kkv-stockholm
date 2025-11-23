'use client';

import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
	ctx: RenderConfigScreenCtx;
};

export function ConfigScreen({ ctx }: PropTypes) {
	return <Canvas ctx={ctx}>KKV plugin settings...</Canvas>;
}

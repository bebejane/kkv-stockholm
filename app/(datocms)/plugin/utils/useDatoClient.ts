'use client';

import { RenderPageCtx } from 'datocms-plugin-sdk';

export type DatoClientConfigProps = {
	ctx: RenderPageCtx;
};

export function getDatoClientConfig(ctx: RenderPageCtx) {
	if (!ctx.currentUserAccessToken) {
		ctx.alert('This plugin requires the currentUserAccessToken permission.');
		return null;
	}

	return {
		token: ctx.currentUserAccessToken,
		environment: ctx.environment,
	};
}

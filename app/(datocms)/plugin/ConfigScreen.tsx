'use client';

import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, SwitchField } from 'datocms-react-ui';

type PropTypes = {
	ctx: RenderConfigScreenCtx;
};

export function ConfigScreen({ ctx }: PropTypes) {
	async function handleOnChange(enabled: boolean) {
		console.log('update plugin params');
		await ctx.updatePluginParameters({ enabled });
	}

	const enabled = (ctx.plugin.attributes.parameters?.enabled ?? true) as boolean;

	return (
		<Canvas ctx={ctx}>
			Settings
			{/* <SwitchField
				id='enabled'
				name='enabled'
				onChange={handleOnChange}
				label='Enable plugin'
				value={enabled}
			/> */}
		</Canvas>
	);
}

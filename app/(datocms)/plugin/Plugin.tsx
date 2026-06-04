'use client';

import React from 'react';
import { connect } from 'datocms-plugin-sdk';
import { createRoot, Root } from 'react-dom/client';
import { useEffect } from 'react';
import { ConfigScreen } from './ConfigScreen';
import { IFrame } from '@/app/(datocms)/plugin/IFrame';
import { InvoiceLinkField } from '@/app/(datocms)/plugin/InvoiceLinkField';

type PluginPageProps = {
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function Plugin({ allWorkshops }: PluginPageProps) {
	const isIFrame = typeof window !== 'undefined' && window.self !== window.top;
	let rootElement: HTMLElement | null = null;
	let root: Root | null = null;
	const connecting = React.useRef(false);

	function render(component: React.ReactNode) {
		rootElement = rootElement ?? document.getElementById('root');
		root = root ?? createRoot(rootElement as HTMLElement);
		root?.render(<React.StrictMode>{component}</React.StrictMode>);
	}

	useEffect(() => {
		if (connecting.current || !isIFrame) return;
		connecting.current = true;
		console.log('connect KKV plugin');
		connect({
			manualFieldExtensions() {
				return [
					{
						id: 'invoiceLink',
						name: 'Spiris Invoice Link',
						type: 'addon' as const,
						fieldTypes: ['string'],
					},
				];
			},
			overrideFieldExtensions(field) {
				if (field.attributes.api_key === 'invoice_id') {
					return {
						addons: [{ id: 'invoiceLink' }],
					};
				}
			},
			renderFieldExtension(fieldExtensionId, ctx) {
				if (fieldExtensionId === 'invoiceLink') {
					render(<InvoiceLinkField ctx={ctx} />);
				}
			},
			renderConfigScreen(ctx) {
				render(<ConfigScreen ctx={ctx} />);
			},
			renderPage(pageId, ctx) {
				if (ctx.plugin.attributes.parameters?.enabled === false) return;
				switch (pageId) {
					case 'downloads':
						return render(<IFrame ctx={ctx} src={'/admin/rapporter'} />);
					case 'calendar':
						return render(<IFrame ctx={ctx} src={'/admin/kalender'} />);
					case 'invoices':
						return render(<IFrame ctx={ctx} src={'/admin/fakturor'} />);
				}
			},
			mainNavigationTabs(ctx) {
				if (ctx.plugin.attributes.parameters?.enabled === false) return [];
				const isDev = process.env.NODE_ENV === 'development';

				return [
					{
						label: `Calendar ${isDev ? '(dev)' : ''}`,
						icon: 'calendar',
						pointsTo: {
							pageId: 'calendar',
						},
						placement: ['after', 'media'],
					},
					{
						label: `Invoices ${isDev ? '(dev)' : ''}`,
						icon: 'table',
						pointsTo: {
							pageId: 'invoices',
						},
						placement: ['after', 'media'],
					},
					{
						label: `Downloads ${isDev ? '(dev)' : ''}`,
						icon: 'table',
						pointsTo: {
							pageId: 'downloads',
						},
						placement: ['after', 'media'],
					},
				];
			},
		})
			.then((res) => {
				console.log('connected KKV plugin');
			})
			.catch((err) => {
				console.error('error connecting KKV plugin');
				console.error(err);
			})
			.finally(() => {
				connecting.current = false;
			});
	}, []);

	return null;
}

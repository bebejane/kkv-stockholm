'use client';

import React from 'react';
import { connect } from 'datocms-plugin-sdk';
import { createRoot, Root } from 'react-dom/client';
import { useEffect } from 'react';
import 'datocms-react-ui/styles.css';
import { ConfigScreen } from './ConfigScreen';
import { InvoiceLinkField } from '@/app/(datocms)/plugin/InvoiceLinkField';
import { CalendarPage } from '@/app/(datocms)/plugin/pages/CalendarPage';
import { InvoicesPage } from '@/app/(datocms)/plugin/pages/InvoicesPage';
import { DownloadsPage } from '@/app/(datocms)/plugin/pages/DownloadsPage';

const isDev = process.env.NODE_ENV === 'development';

export function Plugin() {
	const isIFrame = typeof window !== 'undefined' && window.self !== window.top;
	const connecting = React.useRef(false);
	let root: Root | null = null;

	function render(component: React.ReactNode) {
		const rootElement = document.getElementById('root');
		root ??= createRoot(rootElement as HTMLElement);
		root.render(<React.StrictMode>{component}</React.StrictMode>);
	}

	useEffect(() => {
		if (connecting.current || !isIFrame) return;
		connecting.current = true;
		console.log('connect KKV plugin', isDev);
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
				switch (pageId) {
					case 'downloads':
						return render(<DownloadsPage ctx={ctx} />);
					case 'calendar':
						return render(<CalendarPage ctx={ctx} />);
					case 'invoices':
						return render(<InvoicesPage ctx={ctx} />);
				}
			},
			contentAreaSidebarItems(ctx) {
				const suffix = isDev ? ' (dev)' : '';
				return [
					{
						label: `Calendar${suffix}`,
						icon: 'calendar',
						pointsTo: { pageId: 'calendar' },
						placement: ['after', 'menuItems'],
					},
					{
						label: `Invoices${suffix}`,
						icon: 'file-invoice-dollar',
						pointsTo: { pageId: 'invoices' },
						placement: ['after', 'menuItems'],
					},
					{
						label: `Downloads${suffix}`,
						icon: 'file-download',
						pointsTo: { pageId: 'downloads' },
						placement: ['after', 'menuItems'],
					},
				];
			},
		})
			.then(() => {
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

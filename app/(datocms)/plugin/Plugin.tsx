'use client';

import React from 'react';
import { connect } from 'datocms-plugin-sdk';
import { createRoot, Root } from 'react-dom/client';
import { useEffect } from 'react';
import { buildClient, Client } from '@datocms/cma-client';
import { ItemType } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { ConfigScreen } from './ConfigScreen';
import { ReportPage } from './pages/ReportPage';

export function Plugin() {
	let rootElement: HTMLElement | null = null;
	let root: Root | null = null;

	let client: Client | null = null;
	let itemTypes: ItemType[] | null = null;

	function render(component: React.ReactNode) {
		rootElement = rootElement ?? document.getElementById('root');
		root = root ?? createRoot(rootElement as HTMLElement);
		root?.render(<React.StrictMode>{component}</React.StrictMode>);
	}

	useEffect(() => {
		console.log('connect KKV plugin');

		connect({
			onBoot(ctx) {
				if (!ctx.currentUserAccessToken) return;
				client = buildClient({
					apiToken: ctx.currentUserAccessToken,
					environment: ctx.environment,
				});
				client?.itemTypes.list().then((res) => (itemTypes = res));
			},
			renderConfigScreen(ctx) {
				render(
					<React.StrictMode>
						<ConfigScreen ctx={ctx} />
					</React.StrictMode>,
				);
			},
			renderPage(pageId, ctx) {
				switch (pageId) {
					case 'reports':
						return render(<ReportPage ctx={ctx} />);
				}
			},
			mainNavigationTabs(ctx) {
				return [
					{
						label: 'Reports',
						icon: 'table',
						pointsTo: {
							pageId: 'reports',
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
			});
	}, []);

	return null;
}

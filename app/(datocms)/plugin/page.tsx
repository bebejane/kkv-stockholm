'use client';

import React from 'react';
import { connect } from 'datocms-plugin-sdk';
import { createRoot, Root } from 'react-dom/client';
import { useEffect } from 'react';
import { ConfigScreen } from './components/ConfigScreen';
import { ReportPage } from './components/ReportPage';

export default function Plugin() {
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
			renderConfigScreen(ctx) {
				render(<ConfigScreen ctx={ctx} />);
			},
			renderPage(pageId, ctx) {
				if (ctx.plugin.attributes.parameters?.enabled === false) return;
				switch (pageId) {
					case 'reports':
						return render(<ReportPage ctx={ctx} />);
				}
			},
			mainNavigationTabs(ctx) {
				if (ctx.plugin.attributes.parameters?.enabled === false) return [];
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
			})
			.finally(() => {
				connecting.current = false;
			});
	}, []);

	return null;
}

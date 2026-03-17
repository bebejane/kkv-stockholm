'use client';

import React from 'react';
import { connect } from 'datocms-plugin-sdk';
import { createRoot, Root } from 'react-dom/client';
import { useEffect } from 'react';
import { ConfigScreen } from './ConfigScreen';
import { ReportPage } from './ReportPage';
import { CalendarPage } from './CalendarPage';

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
		root?.render(<>{component}</>);
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
					case 'calendar':
						return render(<CalendarPage ctx={ctx} allWorkshops={allWorkshops} />);
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
					{
						label: 'Calendar',
						icon: 'calendar',
						pointsTo: {
							pageId: 'calendar',
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

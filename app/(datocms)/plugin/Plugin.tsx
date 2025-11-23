'use client';

import { connect } from 'datocms-plugin-sdk';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useEffect, useMemo } from 'react';
import { Booking, Member, Report, Workshop } from '@/types/datocms';
import { buildClient, Client } from '@datocms/cma-client';
import { Item, ItemType } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { format } from 'date-fns';
import { se, sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import { getItemCached } from './utils';
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
				console.log('boot');
				console.log('root', root);
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
					</React.StrictMode>
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
						placement: ['after', 'schema'],
					},
				];
			},
			async buildItemPresentationInfo(item, ctx) {
				if (!client) return undefined;

				const itemTypeId = item.relationships.item_type?.data?.id;
				const apiKey = itemTypes?.find(({ id }) => id === itemTypeId)?.api_key;

				switch (apiKey) {
					case 'booking':
						const booking = item.attributes as Item<Booking>;
						const member = await getItemCached<Item<Member>>(booking.member as string, client);
						if (!member) return undefined;

						const name = `${member?.first_name} ${member?.last_name}`;
						const from = capitalize(format(new Date(booking.start as string), 'EEEE: HH:mm', { locale: sv }));
						const to = format(new Date(booking.end as string), 'HH:mm', { locale: sv });
						const title = `${from} - ${to}`;

						return {
							title,
						};

					case 'member':
						//const member = item.attributes as Item<Member>;
						return {
							title: `${item.attributes.first_name} ${item.attributes.last_name}`,
						};

					case 'report':
						const report = item.attributes as Item<Report>;
						const workshop = await getItemCached<Item<Workshop>>(report.workshop as string, client);
						const m = await getItemCached<Item<Member>>(report.member as string, client);
						const n = `${m?.first_name} ${m?.last_name}`;

						return {
							title: `${n} - ${workshop?.title} - ${format(new Date(report.date as string), 'dd/MM HH:mm')} : `,
						};

					default:
						return undefined;
				}
			},
		})
			.then((res) => {
				console.log('connected KKV plugin');
			})
			.catch((err) => {
				console.error('error connecting KKV plugin');
			});
	}, []);

	return null;
}

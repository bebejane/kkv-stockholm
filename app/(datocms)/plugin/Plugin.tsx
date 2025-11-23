'use client';

import { connect } from 'datocms-plugin-sdk';
import { useEffect, useMemo } from 'react';
import { Booking, Member } from '@/types/datocms';
import { buildClient, Client } from '@datocms/cma-client';
import { Item, ItemType } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import { getMember } from './utils';

export function Plugin() {
	let client: Client | null = null;
	let itemTypes: ItemType[] | null = null;

	useMemo(() => {
		console.log('connect KKV plugin');
	}, []);

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
				return undefined;
			},
			async buildItemPresentationInfo(item, ctx) {
				if (!client) return undefined;

				const itemTypeId = item.relationships.item_type?.data?.id;
				const apiKey = itemTypes?.find(({ id }) => id === itemTypeId)?.api_key;

				switch (apiKey) {
					case 'booking':
						const booking = item.attributes as Item<Booking>;
						const member = await getMember(booking.member as string, client);
						if (!member) return undefined;

						const name = `${member?.first_name} ${member?.last_name}`;
						const from = format(new Date(booking.start as string), 'EEEE: HH:mm', { locale: sv });
						const to = format(new Date(booking.end as string), 'HH:mm', { locale: sv });
						const title = capitalize(`${from} - ${to} - ${name}`);

						return {
							title,
						};
					case 'member':
						return {
							title: `${item.attributes.first_name} ${item.attributes.last_name}`,
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

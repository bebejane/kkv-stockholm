'use client';

import React, { useCallback } from 'react';
import { connect } from 'datocms-plugin-sdk';
import type { BuildItemPresentationInfoCtx } from 'datocms-plugin-sdk';
import { createRoot, Root } from 'react-dom/client';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { buildClient } from '@datocms/cma-client-browser';
import 'datocms-react-ui/styles.css';
import { ConfigScreen } from './ConfigScreen';
import { InvoiceLinkField } from '@/app/(datocms)/plugin/InvoiceLinkField';
import { CalendarPage } from '@/app/(datocms)/plugin/pages/CalendarPage';
import { InvoicesPage } from '@/app/(datocms)/plugin/pages/InvoicesPage';
import { DownloadsPage } from '@/app/(datocms)/plugin/pages/DownloadsPage';

const isDev = process.env.NODE_ENV === 'development';

const workshopTitleCache = new Map<string, string>();

function stringValue(value: unknown): string {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object') {
		const first = Object.values(value as Record<string, unknown>).find(
			(entry) => typeof entry === 'string' && entry,
		);
		if (typeof first === 'string') return first;
	}
	return '';
}

/** Reads a field from a CMA item, which may be flattened (field on the item) or raw (`attributes`). */
function getAttributes(item: unknown): Record<string, unknown> {
	const record = (item ?? {}) as Record<string, unknown>;
	return (record.attributes ?? record) as Record<string, unknown>;
}

function getRelationshipId(item: unknown, field: string): string | undefined {
	const record = (item ?? {}) as Record<string, unknown>;
	const relationships = record.relationships as
		| Record<string, { data?: { id?: string } | null } | undefined>
		| undefined;
	const fromRelationship = relationships?.[field]?.data?.id;
	if (fromRelationship) return fromRelationship;

	const attribute = getAttributes(item)[field];
	if (typeof attribute === 'string') return attribute;
	if (
		attribute &&
		typeof attribute === 'object' &&
		typeof (attribute as { id?: string }).id === 'string'
	)
		return (attribute as { id: string }).id;

	return undefined;
}

async function loadWorkshopTitle(
	workshopId: string,
	ctx: BuildItemPresentationInfoCtx,
): Promise<string> {
	const cached = workshopTitleCache.get(workshopId);
	if (cached !== undefined) return cached;

	if (!ctx.currentUserAccessToken) return '';

	try {
		const client = buildClient({
			apiToken: ctx.currentUserAccessToken,
			environment: ctx.environment,
			baseUrl: ctx.cmaBaseUrl,
		});
		const workshop = await client.items.find(workshopId);
		const title = stringValue(getAttributes(workshop).title);
		workshopTitleCache.set(workshopId, title);
		return title;
	} catch {
		return '';
	}
}

function formatBookingRange(start: unknown, end: unknown): string {
	const startValue = stringValue(start);
	if (!startValue) return '';

	const startDate = new Date(startValue);
	if (Number.isNaN(startDate.getTime())) return '';

	const endValue = stringValue(end);
	if (!endValue) return format(startDate, 'd MMM yyyy');

	const endDate = new Date(endValue);
	if (Number.isNaN(endDate.getTime())) return format(startDate, 'd MMM yyyy');

	const isSameDay =
		startDate.getFullYear() === endDate.getFullYear() &&
		startDate.getMonth() === endDate.getMonth() &&
		startDate.getDate() === endDate.getDate();

	if (isSameDay) return format(startDate, 'd MMM yyyy');

	if (
		startDate.getMonth() === endDate.getMonth() &&
		startDate.getFullYear() === endDate.getFullYear()
	)
		return `${format(startDate, 'd')}–${format(endDate, 'd MMM yyyy')}`;

	return `${format(startDate, 'd MMM')} – ${format(endDate, 'd MMM yyyy')}`;
}

// React root for the plugin UI. Created once and reused: `renderPage` /
// `renderFieldExtension` can fire repeatedly, and calling `createRoot()` again
// on the same container throws. It also must not target `#root` (`<body>`),
// which Next already controls.
let pluginRoot: Root | null = null;

function renderPlugin(component: React.ReactNode): void {
	if (typeof document === 'undefined') return;

	let container = document.getElementById('datocms-plugin-root');
	if (!container) {
		container = document.createElement('div');
		container.id = 'datocms-plugin-root';
		container.style.minHeight = '100vh';
		document.body.appendChild(container);
	}

	pluginRoot ??= createRoot(container);
	pluginRoot.render(<React.StrictMode>{component}</React.StrictMode>);
}

export function Plugin() {
	const isIFrame = typeof window !== 'undefined' && window.self !== window.top;
	const connecting = React.useRef(false);
	const connected = React.useRef(false);

	const render = useCallback((component: React.ReactNode) => {
		renderPlugin(component);
	}, []);

	useEffect(() => {
		if (connecting.current || connected.current || !isIFrame) return;
		connecting.current = true;

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
			buildItemPresentationInfo(item, ctx) {
				const itemTypeId = getRelationshipId(item, 'item_type');
				const itemType = itemTypeId ? ctx.itemTypes[itemTypeId] : undefined;
				const apiKey = itemType?.attributes.api_key;
				const attributes = getAttributes(item);

				if (apiKey === 'member') {
					const name = [stringValue(attributes.first_name), stringValue(attributes.last_name)]
						.filter(Boolean)
						.join(' ')
						.trim();
					const email = stringValue(attributes.email);

					const title = [name, email ? `(${email})` : ''].filter(Boolean).join(' ').trim();
					return title ? { title } : undefined;
				}

				if (apiKey === 'booking') {
					const range = formatBookingRange(attributes.start, attributes.end);
					const workshopId = getRelationshipId(item, 'workshop');

					const withTitle = (workshopTitle: string) =>
						[workshopTitle, range].filter(Boolean).join(' - ').trim();

					if (!workshopId) {
						const title = withTitle('');
						return title ? { title } : undefined;
					}

					const cached = workshopTitleCache.get(workshopId);
					if (cached !== undefined) {
						const title = withTitle(cached);
						return title ? { title } : undefined;
					}

					return loadWorkshopTitle(workshopId, ctx).then((workshopTitle) => {
						const title = withTitle(workshopTitle);
						return title ? { title } : undefined;
					});
				}

				return undefined;
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
				connected.current = true;
				connecting.current = false;
			});
	}, [isIFrame, render]);

	return null;
}

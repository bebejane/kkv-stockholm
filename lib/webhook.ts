import { BadRequestError } from '@/lib/errors';

export type DatoWebhookItem = {
	eventType: string;
	entity: {
		id: string;
		attributes: Record<string, unknown>;
	};
};

type RawWebhookBody = {
	entity_type?: string;
	event_type?: string;
	entity?: {
		id?: string;
		type?: string;
		attributes?: Record<string, unknown>;
	};
};

/**
 * Validates the shape of a DatoCMS record webhook payload
 * (https://www.datocms.com/docs/general-concepts/webhooks) and returns the
 * entity. Rejects anything that is not a record event of the expected type.
 */
export function parseItemWebhook(
	body: unknown,
	options: { eventTypes: string[] },
): DatoWebhookItem {
	const b = (body ?? null) as RawWebhookBody | null;

	if (
		!b ||
		typeof b !== 'object' ||
		b.entity_type !== 'item' ||
		b.entity?.type !== 'item' ||
		!b.entity?.id ||
		!b.event_type ||
		!options.eventTypes.includes(b.event_type)
	) {
		throw new BadRequestError('Invalid webhook payload');
	}

	return {
		eventType: b.event_type,
		entity: {
			id: b.entity.id,
			attributes: b.entity.attributes ?? {},
		},
	};
}

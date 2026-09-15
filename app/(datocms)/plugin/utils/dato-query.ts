import { print } from 'graphql/language/printer.js';
import type { DocumentNode } from 'graphql';

/**
 * Client config used by plugin pages. `token` is the DatoCMS user access token
 * that authorizes plugin requests against our server routes; Dato content is
 * read through the proxy in `/api/plugin/query`.
 */
export type DatoClientConfig = {
	token: string;
	environment: string;
};

export type DatoQueryOptions = {
	variables?: Record<string, unknown>;
	includeDrafts?: boolean;
};

export async function datoQuery<TResult = Record<string, unknown>>(
	config: DatoClientConfig,
	document: DocumentNode,
	options: DatoQueryOptions = {},
): Promise<TResult> {
	const response = await fetch('/api/plugin/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${config.token}`,
		},
		body: JSON.stringify({
			query: print(document),
			variables: options.variables ?? {},
			includeDrafts: options.includeDrafts ?? false,
		}),
	});

	const body = await response.json();

	if (!response.ok)
		throw new Error(
			body?.errors?.[0]?.message ??
				body?.error ??
				`${response.status}: ${response.statusText}`,
		);
	if (body.errors) throw new Error(body.errors.map((e: any) => e.message).join('. '));

	return body.data as TResult;
}

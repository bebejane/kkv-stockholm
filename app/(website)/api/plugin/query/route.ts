import { NextRequest, NextResponse } from 'next/server';
import { getDatoPluginSession, unauthorized } from '@/lib/dato-plugin-auth';
import { errorResponse } from '@/lib/errors';

/**
 * Proxies GraphQL queries to the DatoCMS Content Delivery API using the
 * server-side full-access token, gated by DatoCMS plugin authentication.
 */
export async function POST(req: NextRequest) {
	const session = await getDatoPluginSession(req);
	if (!session) return unauthorized();

	try {
		const body = await req.json();
		const { query, variables, includeDrafts } = body;

		if (typeof query !== 'string') {
			return NextResponse.json({ error: 'query is required' }, { status: 400 });
		}

		const environment =
			process.env.DATOCMS_ENVIRONMENT ?? process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT ?? 'main';

		const headers: Record<string, string> = {
			'Authorization': `Bearer ${process.env.DATOCMS_API_TOKEN}`,
			'X-Environment': environment,
			'Content-Type': 'application/json',
			...(includeDrafts ? { 'X-Include-Drafts': 'true' } : {}),
		};

		if (includeDrafts && process.env.NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL) {
			headers['X-Base-Editing-Url'] = process.env.NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL;
		}

		const graphqlReq = {
			method: 'POST',
			headers,
			body: JSON.stringify({ query, variables: variables ?? {} }),
		};

		let data = await (await fetch(GRAPHQL_QUERY_URL, graphqlReq)).json();

		if (data.errors) {
			return NextResponse.json({ errors: data.errors }, { status: 400 });
		}

		const hasPagination = /\$first\s*:/i.test(query);

		if (includeDrafts && hasPagination) {
			const first = Math.min(Number(variables?.first ?? 100), 500);
			let skip = Number(variables?.skip ?? 0);
			let done = false;

			while (!done) {
				const page = await fetch(GRAPHQL_QUERY_URL, {
					...graphqlReq,
					body: JSON.stringify({ query, variables: { ...(variables ?? {}), first, skip } }),
				}).then((res) => res.json());

				if (page.errors) {
					return NextResponse.json({ errors: page.errors }, { status: 400 });
				}

				done = true;
				for (const [key, value] of Object.entries(page.data ?? {})) {
					if (key.startsWith('_all') && key.endsWith('Meta')) {
						data[key] = value;
						continue;
					}
					if (Array.isArray(value)) {
						data[key] = [...((data[key] as unknown[]) ?? []), ...value];
						if (value.length >= first) {
							done = false;
							skip += first;
						}
					} else {
						data[key] = value;
					}
				}
			}
		}

		return NextResponse.json(data);
	} catch (e) {
		return errorResponse(e);
	}
}

const GRAPHQL_QUERY_URL = 'https://graphql.datocms.com/';

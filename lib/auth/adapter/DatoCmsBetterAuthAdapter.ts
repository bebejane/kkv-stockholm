import { ApiError, buildClient, Client } from '@datocms/cma-client';
import { createAdapterFactory } from 'better-auth/adapters';
import type { Where } from 'better-auth';
import { User } from '@/types/datocms-cma';

export interface DatoCmsAdapterConfig {
	/**
	 * DatoCms instance or configuration
	 * You can provide:
	 *   - a DatoCms Client instance
	 *   - or an object with { apitoken }
	 */
	client: Client | { apiToken?: string };

	/**
	 * DatoCms Item Type Id Mapping
	 * @default undefined
	 */
	itemTypeId: {
		user: string;
		session: string;
		account: string;
		verification: string;
	};

	/**
	 * Enable debug logs for the adapter
	 * @default false
	 */
	debugLogs?: boolean;
}

/**
 * Better Auth adapter for DatoCms
 */
export const datoCmsAdapter = ({ client, debugLogs = false, itemTypeId }: DatoCmsAdapterConfig) => {
	const c = client instanceof Client ? client : buildClient({ apiToken: client.apiToken as string });
	const pageSize = 100;
	const version = 'current';

	function ensureAuth(): boolean {
		if (client instanceof Client) return true;
		return false;
	}

	function getItemTypeId(model: string): string {
		if (!(model in itemTypeId)) throw new Error(`Item type ${model} not found`);
		return itemTypeId[model as keyof typeof itemTypeId];
	}

	function buildFilter(where: Where[] | undefined, itemTypeId: string): any {
		if (!where || where.length === 0) return { type: itemTypeId };

		let fields: any = {};
		const AND = [];
		const OR = [];

		for (const item of where) {
			const field = item.field;
			const value = typeof item.value === 'string' ? `${item.value}` : item.value;
			const operator = item.operator as string;
			const connector = item.connector as string;
			const q: any = {};

			switch (operator) {
				case 'in':
					if (Array.isArray(item.value)) q[field] = { [operator]: item.value };
					break;
				case 'contains':
					q[field] = { matches: { pattern: value } };
					break;
				case 'starts_with':
					q[field] = { matches: { pattern: `^${value}` } };
					break;
				case 'ends_with':
					q[field] = { matches: { pattern: `${value}$` } };
					break;
				default:
					q[field] = { [operator]: value };
					break;
			}

			connector === 'AND' && AND.push(q);
			connector === 'OR' && OR.push(q);
			!connector && (fields = { ...fields, ...q });
		}

		const filter: any = { type: itemTypeId };

		Object.keys(fields).length > 0 && (filter.fields = fields);
		AND.length > 0 && (filter.AND = AND);
		OR.length > 0 && (filter.OR = OR);

		//console.log('filter format', JSON.stringify(filter, null, 2));

		return filter;
	}

	function handleApiError(type: string, error: any, throws: boolean = false) {
		if (debugLogs) {
			let message = '';
			if (error instanceof ApiError) {
				//console.log(JSON.stringify(error, null, 2));
				message = `[DatoCms ApiError] ${type} error: ${error.message}`;
			} else if (error instanceof Error) message = `[Error] ${type} error: ${error.message}`;
			else console.error(`[Error] ${type} error:`, error);

			console.error(message);
		}
		if (throws) throw error;
	}
	return createAdapterFactory({
		config: {
			adapterId: 'datocms',
			adapterName: 'DatoCms Adapter',
			debugLogs,
			usePlural: false,
			supportsDates: false,
			supportsBooleans: true,
			supportsJSON: false,
			supportsNumericIds: false,
			disableIdGeneration: true,
			mapKeysTransformInput: {
				createdAt: 'created_at',
				updatedAt: 'updated_at',
				expiresAt: 'expires_at',
				emailVerified: 'email_verified',
				sessionId: 'session_id',
				userAgent: 'user_agent',
				ipAddress: 'ip_address',
				userId: 'user_id',
				userVerificationTokens: 'user_verification_tokens',
				accountId: 'account_id',
				providerId: 'provider_id',
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
				idToken: 'id_token',
				accessTokenExpiresAt: 'access_token_expires_at',
				refreshTokenExpiresAt: 'refresh_token_expires_at',
			},
			mapKeysTransformOutput: {
				created_at: 'createdAt',
				updated_at: 'updatedAt',
				expires_at: 'expiresAt',
				email_verified: 'emailVerified',
				session_id: 'sessionId',
				user_agent: 'userAgent',
				ip_address: 'ipAddress',
				user_id: 'userId',
				user_verification_tokens: 'userVerificationTokens',
				account_id: 'accountId',
				provider_id: 'providerId',
				access_token: 'accessToken',
				refresh_token: 'refreshToken',
				id_token: 'idToken',
				access_token_expires_at: 'accessTokenExpiresAt',
				refresh_token_expires_at: 'refreshTokenExpiresAt',
			},
			customTransformInput({ data, field }) {
				switch (field) {
					case 'created_at':
						return undefined;
					case 'updated_at':
						return undefined;
					default:
						return data;
				}
			},
			customTransformOutput({ data }) {
				//console.log('output', model, field, data);
				return data;
			},
		},
		adapter: ({ getModelName, debugLog }) => {
			return {
				async create({ data, model }) {
					debugLog('create', { model, data });
					const itemTypeId = getItemTypeId(model);

					try {
						const record = await c.items.create({
							item_type: {
								id: itemTypeId,
								type: 'item_type',
							},
							...data,
						});
						return record as any;
					} catch (error) {
						handleApiError('create', error, true);
					}
				},
				async findOne({ model, where }) {
					debugLog('findOne', { model, where });

					const collectionName = getModelName(model);
					const itemTypeId = await getItemTypeId(collectionName);
					const filter = buildFilter(where, itemTypeId);
					console.log('filter', filter);

					try {
						const result = await c.items.list({
							filter,
							page: {
								limit: 1,
							},
							version,
						});

						return (result[0] as any) || null;
					} catch (error) {
						handleApiError('findOne', error);
						return null;
					}
				},
				async findMany({ model, where, limit, offset: _offset, sortBy }) {
					debugLog('findMany', { model, where, limit, offset: _offset, sortBy });

					const collectionName = getModelName(model);
					const itemTypeId = await getItemTypeId(collectionName);
					const filter = buildFilter(where, itemTypeId);
					const order_by = sortBy ? `${sortBy.field}_${sortBy.direction === 'desc' ? 'DESC' : 'ASC'}` : undefined;
					const offset = _offset ? Math.floor(_offset / (limit || pageSize)) + 1 : 0;
					const page = {
						offset,
						limit: pageSize,
					};

					try {
						const result = await c.items.list({
							item_type: {
								id: itemTypeId,
								type: 'item_type',
							},
							filter,
							page,
							order_by,
							version,
						});

						return result as any[];
					} catch (error) {
						handleApiError('findMany', error);
						return [];
					}
				},
				async count({ model, where }) {
					debugLog('count', { model, where });

					const collectionName = getModelName(model);
					const itemTypeId = await getItemTypeId(collectionName);
					const filter = buildFilter(where, itemTypeId);

					try {
						const result = await c.items.rawList<User>({
							item_type: {
								id: itemTypeId,
								type: 'item_type',
							},
							page: {
								limit: 1,
							},
							filter,
							version,
						});
						return result.meta.total_count;
					} catch (error) {
						handleApiError('count', error);
						return 0;
					}
				},
				async update({ model, where, update }) {
					debugLog('update', { model, where, update });

					const collectionName = getModelName(model);
					const itemTypeId = await getItemTypeId(collectionName);
					const filter = buildFilter(where, itemTypeId);

					try {
						const item = (
							await c.items.list({
								item_type: {
									id: itemTypeId,
									type: 'item_type',
								},
								filter,
								version,
							})
						)[0];

						if (!item) return null;

						const newItem = await c.items.update(item.id, {
							item_type: {
								id: itemTypeId,
								type: 'item_type',
							},
							...update,
							version,
						});

						return newItem as any;
					} catch (error) {
						handleApiError('update', error);
						return 0;
					}
				},
				async updateMany({ model, where, update }) {
					debugLog('updateMany', { model, where, update });

					const collectionName = getModelName(model);
					const itemTypeId = await getItemTypeId(collectionName);
					const filter = buildFilter(where, itemTypeId);
					let count = 0;

					try {
						const allRecords = [];
						for await (const record of c.items.listPagedIterator({ version, filter })) allRecords.push(record);

						for (const record of allRecords) {
							await c.items.update(record.id, {
								item_type: {
									id: itemTypeId,
									type: 'item_type',
								},
								...update,
								version,
							});
							count++;
						}

						return count;
					} catch (error) {
						handleApiError('updateMany', error);
						return 0;
					}
				},
				async delete({ model, where }) {
					debugLog('delete', { model, where });

					const collectionName = getModelName(model);
					const itemTypeId = await getItemTypeId(collectionName);
					const filter = buildFilter(where, itemTypeId);

					try {
						const item = (
							await c.items.list({
								item_type: {
									id: itemTypeId,
									type: 'item_type',
								},
								filter,
								page: {
									limit: 1,
								},
								version,
							})
						)[0];

						await c.items.destroy(item.id);
					} catch (error) {
						handleApiError('delete', error);
					}
				},
				async deleteMany({ model, where }) {
					debugLog('deleteMany', { model, where });

					const collectionName = getModelName(model);
					const itemTypeId = await getItemTypeId(collectionName);
					const filter = buildFilter(where, itemTypeId);

					try {
						const items = await c.items.list({
							item_type: {
								id: itemTypeId,
								type: 'item_type',
							},
							filter,
							version,
						});

						await c.items.bulkDestroy({ items });
						return items.length;
					} catch (error) {
						handleApiError('deleteMany', error);
						return 0;
					}
				},
				options: { debugLogs },
			};
		},
	});
};

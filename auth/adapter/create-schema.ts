import { DBAdapterSchemaCreation, AdapterFactoryCustomizeAdapterCreator, DBAdapter } from 'better-auth/adapters';

export async function createSchema({ tables, file }): Promise<DBAdapterSchemaCreation> {
	console.log(tables, file);
	return {} as any;
}

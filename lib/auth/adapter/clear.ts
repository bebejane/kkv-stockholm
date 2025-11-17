import 'dotenv/config';
import { buildClient } from '@datocms/cma-client';
const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN as string,
});
(async () => {
	const models = ['auth_user', 'auth_account', 'auth_session', 'auth_verification'];
	const allItems = await Promise.all(
		models.reverse().map((model) =>
			client.items.list({
				filter: {
					type: model,
				},
			})
		)
	);

	const items = allItems.flat();

	for (const item of items) {
		await client.items.destroy(item.id);
	}
})();

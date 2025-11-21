import 'dotenv/config';
import { buildClient } from '@datocms/cma-client';
export { ApiError, buildBlockRecord } from '@datocms/cma-client';
export const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN as string,
	environment: process.env.DATOCMS_ENVIRONMENT,
});

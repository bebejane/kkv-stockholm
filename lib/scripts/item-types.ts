import { client } from '@/lib/client';
import child_process from 'node:child_process';

export async function listPublicItemTypes() {
	console.log('listing item types...');
	const excluded = ['booking', 'member', 'report'];
	const itemTypes = await client.itemTypes.list();
	const t = itemTypes.filter(
		({ api_key, modular_block }) => !api_key.startsWith('auth_') && !modular_block && !excluded.includes(api_key)
	);
	const data = t.map(({ api_key }) => api_key).join(',');
	const proc = child_process.spawn('pbcopy');
	proc.stdin.write(data);
	proc.stdin.end();
	console.log(data);
}
listPublicItemTypes();

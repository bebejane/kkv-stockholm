import 'dotenv/config';
import { execSync } from 'node:child_process';

/**
 * Manually runs the auto-reports cron (e.g. to retry after a failed run).
 *
 * Usage (month is 0-based, matching the endpoint: 0 = January):
 *   pnpm cron:auto-reports            # last month
 *   pnpm cron:auto-reports 7 2026     # August 2026
 *   CRON_URL=https://example.com pnpm cron:auto-reports 7 2026
 */
const [month, year] = process.argv.slice(2);

const base =
	process.env.CRON_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const secret = process.env.CRON_SECRET;

if (!secret) {
	console.error('CRON_SECRET is not set (add it to .env)');
	process.exit(1);
}

const query = month && year ? `?month=${month}&year=${year}` : '';
const url = `${base.replace(/\/$/, '')}/api/cron/auto-reports${query}`;

console.log(`GET ${url}`);

try {
	execSync(`curl -fsS -H "Authorization: Bearer ${secret}" "${url}"`, { stdio: 'inherit' });
	console.log('');
} catch {
	console.error('Request failed');
	process.exit(1);
}

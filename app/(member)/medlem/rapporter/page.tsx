import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';

export default async function Reports({ params }: PageProps<'/medlem/rapporter/[booking]'>) {
	const session = await getSession();
	const { booking: id } = await params;

	return (
		<article>
			<h1>Rapportera tid & kostnader</h1>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/rapporter'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Rapporter`,
		pathname: `/medlem/rapporter`,
	});
}

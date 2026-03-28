import { buildMetadata } from '@/app/(website)/layout';
import { getAdminSession } from '@/auth/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export default async function AdminPage({ params }: PageProps<'/admin'>) {
	const session = await getAdminSession();

	return (
		<article>
			<h1>Rapporter</h1>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/admin/kalender'>): Promise<Metadata> {
	return buildMetadata({
		title: `Admin - Kalender`,
		pathname: `/admin/kalendar`,
	});
}

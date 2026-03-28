import s from './page.module.scss';
import { buildMetadata } from '@/app/(website)/layout';
import { getAdminSession } from '@/auth/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export default async function AdminPage({ params }: PageProps<'/admin'>) {
	const session = await getAdminSession();

	return (
		<article className={s.admin}>
			<h1>Admin</h1>
			<ul>
				<li>
					<Link href='/admin/kalender'>Kalender</Link>
				</li>
				<li>
					<Link href='/admin/rapporter'>Rapporter</Link>
				</li>
				<li>
					<Link href='/admin/logga-ut'>Logga ut</Link>
				</li>
			</ul>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/admin'>): Promise<Metadata> {
	return buildMetadata({
		title: `Admin`,
		pathname: `/admin`,
	});
}

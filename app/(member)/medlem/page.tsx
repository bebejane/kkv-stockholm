import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export { default } from './bokningar/page';

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem`,
		pathname: `/medlem`,
	});
}

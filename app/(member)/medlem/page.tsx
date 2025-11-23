export { default } from './bokningar/page';
import { buildMetadata } from '@/app/(website)/layout';
import { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem`,
		pathname: `/medlem`,
	});
}

import { Metadata } from 'next';
import page from './[about]/page';
import { buildMetadata } from '@/app/(website)/layout';

export default async function AboutUsPage() {
	return page({ params: new Promise((r) => r({ about: 'om-oss' })) } as PageProps<'/om-oss/[about]'>);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Om oss',
		pathname: '/om-oss',
	});
}

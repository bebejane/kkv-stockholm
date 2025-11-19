import { Metadata } from 'next';
import page from './[about]/page';
import { buildMetadata } from '@/app/layout';
export default async function AboutUs() {
	return page({ params: new Promise((r) => r({ about: 'om-oss' })) } as PageProps<'/om-oss/[about]'>);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Om oss',
		pathname: '/om-oss',
	});
}

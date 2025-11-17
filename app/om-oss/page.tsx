import page from './[about]/page';
export default async function AboutUs() {
	return page({ params: new Promise((r) => r({ about: 'om-oss' })) } as PageProps<'/om-oss/[about]'>);
}

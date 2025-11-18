import { Calender } from '@/components/common/Calender';

export default async function CalenderPage({ params }: PageProps<'/calender'>) {
	return (
		<article>
			<Calender />
		</article>
	);
}

import s from './page.module.scss';
import Bookings from '@/components/calender';

export default async function CalenderPage({ params }: PageProps<'/calender'>) {
	return (
		<article>
			<Bookings />
		</article>
	);
}

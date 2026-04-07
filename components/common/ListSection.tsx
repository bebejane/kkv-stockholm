import Link from 'next/link';
import { Empty } from '@/components/common/Empty';

type ListProps = {
	title: string;
	empty: string;
	items: { id: string; href: string; columns: string[] }[];
};

export function ListSection({ title, empty, items }: ListProps) {
	return (
		<section>
			<header className='margin-bottom'>
				<h2>{title}</h2>
			</header>
			{items.length > 0 ? (
				<ul className='list'>
					{items.map(({ id, href, columns }) => (
						<li key={id}>
							<Link className='content-grid mid' href={href}>
								{columns.map((column, index) => (
									<span key={index}>{column}</span>
								))}
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<Empty>{empty}</Empty>
			)}
		</section>
	);
}

import s from './loading.module.scss';

export type LoadingProps = {
	title: string;
	sections: number;
};
export default function Loading({ title = 'Titel', sections = 2 }: { title: string; sections?: number }) {
	return (
		<article className={s.loader}>
			<h1>{title}</h1>
			{Array.from({ length: sections }).map((_, i) => (
				<section key={i}>
					<header></header>
					<ul className='list'>
						<li></li>
					</ul>
				</section>
			))}
		</article>
	);
}

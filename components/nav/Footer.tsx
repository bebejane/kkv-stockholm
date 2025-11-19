import Link from 'next/link';
import s from './Footer.module.scss';
import cn from 'classnames';

type FooterProps = {
	footer: FooterQuery['footer'];
};

export function Footer({ footer }: FooterProps) {
	if (!footer) return null;
	return (
		<footer className={cn("small", s.footer)}>
			<h3>KKV STOCKHOLM</h3>
			<div className={s.wrapper}>
				<div className={s.support}>
					<span>Med stöd av:</span>
					<ul>
						{footer?.support.map(({ name, logo }) => (
							<li key={name}>
								<img src={logo.url} alt={name} />
							</li>
						))}
					</ul>
				</div>
				<div className={s.social}>
					<span>Följ oss på: &nbsp;</span>
					<Link href={footer.instagram}>Instagram</Link> &nbsp;
					<Link href={footer.facebook}>Facebook</Link>
				</div>
			</div>
		</footer>
	);
}

import s from './Loader.module.scss';

export type LoaderProps = {
	message?: string;
};

export function Loader({ message }: LoaderProps) {
	return (
		<div className={s.loader}>
			<div className={s.spinner}>
				<img src='/images/logo.svg' alt='Loader' />
			</div>
			{message && <p>{message}</p>}
		</div>
	);
}

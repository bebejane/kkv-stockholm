import s from './Empty.module.scss';

export function Empty({ message }: { message: string }) {
	return (
		<div className={s.empty}>
			<span>{message}</span>
		</div>
	);
}

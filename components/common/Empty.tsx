import s from './Empty.module.scss';
import cn from 'classnames';

export function Empty({
	children,
	className,
}: {
	children: string | React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn(s.empty, className)}>
			<span>{children}</span>
		</div>
	);
}

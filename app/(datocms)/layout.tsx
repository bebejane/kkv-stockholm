import s from './layout.module.scss';
export default async function DatocmsLayout({ children }: LayoutProps<'/'>) {
	return <div className={s.container}>{children}</div>;
}

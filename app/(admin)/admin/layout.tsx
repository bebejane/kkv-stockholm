import s from './layout.module.scss';
export default async function PluginLayout({ children }: LayoutProps<'/'>) {
	return <main className={s.main}>{children}</main>;
}

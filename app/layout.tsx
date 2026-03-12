import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import '@/styles/index.scss';

export default async function DatocmsLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang='sv-SE'>
			<body id='root'>{children}</body>
		</html>
	);
}

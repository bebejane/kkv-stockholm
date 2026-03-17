import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import '@/styles/index.scss';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/lib/mantine';
import { DateProvider } from '@/components/common/DateProvider';

export default async function DatocmsLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang='sv-SE'>
			<body id='root'>
				<MantineProvider theme={theme}>
					<DateProvider>{children}</DateProvider>
				</MantineProvider>
			</body>
		</html>
	);
}

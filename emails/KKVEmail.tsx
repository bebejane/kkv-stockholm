import { Section, Column, Row, Button } from '@react-email/components';
import Header from './components/Header';
import Heading from './components/Heading';
import Footer from './components/Footer';
import BaseLayout from './components/BaseLayout';
import Text from './components/Text';
import Divider from './components/Divider';
import { spacing, fontSize } from './components/theme';

export type KKVEmailProps = {
	name?: string;
	text?: string;
	title?: string;
	label?: string;
	url?: string;
};

const KKVEmail = ({ name, text, url, label, title }: KKVEmailProps) => (
	<BaseLayout width={600} preview={title}>
		<Header title='KKV Stockholm' openInBrowser={false} />
		<Section style={{ paddingLeft: spacing.s7, paddingRight: spacing.s7 }}>
			<Row>
				<Column>
					<Heading style={{ fontSize: fontSize.lg }}>Hej, {name}</Heading>
					<Text style={{ paddingTop: spacing.s7 }}>{text}</Text>
				</Column>
			</Row>
			{url && (
				<Row>
					<Column>
						<Button href={url}>{label ?? 'Klicka här'}</Button>
					</Column>
				</Row>
			)}
		</Section>

		<Section style={{ paddingLeft: spacing.s7, paddingRight: spacing.s7 }}>
			<Row>
				<Column>
					<Divider />
				</Column>
			</Row>
		</Section>
		<Footer />
	</BaseLayout>
);

export default KKVEmail;

KKVEmail.PreviewProps = {
	name: 'Name',
	title: 'Titel',
	label: 'Klicka här',
	url: process.env.NEXT_PUBLIC_SITE_URL,
	text: 'Text...',
};

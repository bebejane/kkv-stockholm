import 'dotenv/config';
import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

export type TestEmailProps = {
	title: string;
	url: string;
	label: string;
	text: string;
	name: string;
};

//const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
const baseUrl = 'https://kkv-stockholm.vercel.app';

export default function EmailTemplate({ title, url, label, text, name }: TestEmailProps) {
	return (
		<Html>
			<Head />
			<Body className=''>
				<Container className=''>
					<Section className=''>
						<Img width={114} src={`${baseUrl}/images/logo.png`} alt='KKV Logo' className='' />
					</Section>
					<Section className=''>
						<Text className=''>Hej {name},</Text>
						<Text className=''>{text}</Text>
						<Button href={url}>{label}</Button>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

EmailTemplate.PreviewProps = {
	url: 'https://kkv-stockholm.vercel.app',
	label: 'Klicka här',
	text: 'Detta är en testmail',
	title: 'Testmail',
	name: 'Name',
};

import { Section, Column, Img, Row } from '@react-email/components';
import { colors, fontSize, spacing } from './theme';
import Divider from './Divider';
import SubHeading from './SubHeading';
import Text from './Text';

type FooterProps = {
	includeUnsubscribe?: boolean;
};

export default function Footer({ includeUnsubscribe }: FooterProps) {
	return (
		<>
			<Section>
				<Row>
					<Column>
						<Divider />
					</Column>
				</Row>
			</Section>
			<Section>
				<Row>
					<Column style={{ width: '100%', textAlign: 'center' }} align='center'>
						<Img style={{ width: '45px', margin: '0 auto' }} src='https://www.datocms-assets.com/62617/1673342405-logo-email.png' />
					</Column>
				</Row>
			</Section>
			<Section style={{ paddingBottom: spacing.s10 }}>
				<Row>
					<Column style={{ paddingTop: spacing.s6, textAlign: 'center', width: '100%' }}>
						<SubHeading style={{ textAlign: 'center' }}>
							<a style={{ textDecoration: 'none', color: 'white' }} href='https://www.instagram.com/orsjo_belysning'>
								Instagram
							</a>{' '}
							&nbsp;{' '}
							<a style={{ textDecoration: 'none', color: 'white' }} href='https://www.orsjo.com'>
								Website
							</a>{' '}
							&nbsp;{' '}
							<a style={{ textDecoration: 'none', color: 'white' }} href='https://www.facebook.com/orsjobelysning'>
								Facebook
							</a>
						</SubHeading>
						{includeUnsubscribe && (
							<Text
								style={{ paddingTop: spacing.s3, textAlign: 'center', fontSize: fontSize.sm, color: colors.neutral500 }}
							>
								Unsubscribe
							</Text>
						)}
					</Column>
				</Row>
			</Section>
		</>
	);
}

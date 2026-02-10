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
						<Divider style={{ paddingBottom: spacing.s4 }} />
					</Column>
				</Row>
			</Section>
			<Section style={{ paddingBottom: spacing.s10 }}>
				<Row>
					<Column style={{ paddingTop: 0, textAlign: 'center', width: '100%' }}>
						<SubHeading style={{ textAlign: 'center', paddingBottom: spacing.s5 }} className='footer-link no-underline'>
							<a className='footer-link-item' style={{ textDecoration: 'none', textDecorationColor: 'transparent', borderBottom: 'none', border: 'none', color: colors.black }} href='https://www.instagram.com/kkvsthlm/' target='_blank' rel='noopener noreferrer'>
								Instagram
							</a>{' '}
							&nbsp;{' '}
							<a className='footer-link-item' style={{ textDecoration: 'none', textDecorationColor: 'transparent', borderBottom: 'none', border: 'none', color: colors.black }} href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://kkv.nu'}`} target='_blank' rel='noopener noreferrer'>
								Website
							</a>{' '}
							&nbsp;{' '}
							<a className='footer-link-item' style={{ textDecoration: 'none', textDecorationColor: 'transparent', borderBottom: 'none', border: 'none', color: colors.black }} href='https://www.facebook.com/kkvstockholm' target='_blank' rel='noopener noreferrer'>
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

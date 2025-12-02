import { Section, Column, Img, Row } from '@react-email/components';
import { colors, fontSize, spacing } from './theme';
import SubHeading from './SubHeading';
import Text from './Text';
import Divider from './Divider';

type HeaderProps = {
	openInBrowser?: boolean;
	title?: string;
};

const Header: React.FC<HeaderProps> = ({ title, openInBrowser = false }) => {
	return (
		<>
			<Section style={{ paddingTop: spacing.s9, paddingBottom: spacing.s7, backgroundColor: colors.white }}>
				<Row>
					<Column style={{ width: '100%', textAlign: 'center' }} align='center'>
						<Img style={{ width: '216px', margin: '0 auto' }} src='https://www.datocms-assets.com/182970/1764675170-logo_email.png' />
					</Column>
				</Row>
			</Section>
			<Section>
				<Row>
					<Column style={{ width: '100%' }}>
						{openInBrowser && (
							<Text
								style={{ paddingTop: spacing.s3, fontSize: fontSize.sm, color: colors.neutral500, textAlign: 'center' }}
							>
								Open in Browser
							</Text>
						)}
					</Column>
				</Row>
			</Section>
			<Section style={{ paddingBottom: spacing.s3 }}>
				<Row>
					<Column>
						<Divider style={{ paddingBottom: spacing.s4 }} />
					</Column>
				</Row>
			</Section>
		</>
	);
};

export default Header;

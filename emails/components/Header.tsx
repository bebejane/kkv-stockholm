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
			<Section style={{ paddingTop: spacing.s9, backgroundColor: colors.black }}>
				<Row>
					<Column style={{ width: '100%', textAlign: 'center' }} align='center'>
						<Img style={{ width: '45px', margin: '0 auto' }} src='https://www.datocms-assets.com/62617/1673342405-logo-email.png' />
					</Column>
				</Row>
			</Section>
			<Section>
				<Row>
					<Column style={{ width: '100%' }}>
						<SubHeading style={{ textAlign: 'center', paddingTop: spacing.s6 }}>{title}</SubHeading>
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
						<Divider />
					</Column>
				</Row>
			</Section>
		</>
	);
};

export default Header;

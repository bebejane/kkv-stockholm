import { Section, Column, Img, Row } from '@react-email/components';
import { colors, fontSize, spacing, textAlign } from './theme';
import SubHeading from './SubHeading';
import Text from './Text';
import Divider from './Divider';

type HeaderProps = {
	loose?: boolean;
};

const Header: React.FC<HeaderProps> = ({ loose }) => {
	return (
		<>
			<Section style={{ paddingTop: spacing.s10 }} className='lg-hidden'>
				<Row>
					<Column style={{ width: '45px' }}>
						<Img style={{ width: '45px' }} src='https://www.datocms-assets.com/62617/1673342405-logo-email.png' />
					</Column>
					<Column style={{ width: '555px' }}>
						<Text style={{ textAlign: 'right' }}>
							<SubHeading style={{ textAlign: 'right' }}>News from Örsjö Belysning</SubHeading>
						</Text>
						<Text
							style={{ paddingTop: spacing.s10, fontSize: fontSize.sm, color: colors.neutral500, textAlign: 'right' }}
						>
							Open in Browser
						</Text>
					</Column>
				</Row>
			</Section>
			<Section style={{ paddingTop: spacing.s10, backgroundColor: colors.black }} className='sm-hidden'>
				<Row>
					<Column style={{ width: '100%' }}>
						<Img style={{ width: '45px' }} src='https://www.datocms-assets.com/62617/1673342405-logo-email.png' />
					</Column>
					<Column style={{ width: '100%' }}>
						<SubHeading style={{ paddingTop: spacing.s6, textAlign: 'center' }}>News from Örsjö Belysning</SubHeading>
						<Text
							style={{ paddingTop: spacing.s3, fontSize: fontSize.sm, color: colors.neutral500, textAlign: 'center' }}
						>
							Open in Browser
						</Text>
					</Column>
				</Row>
			</Section>
			<Section>
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

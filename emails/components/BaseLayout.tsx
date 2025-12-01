import { Html, Body, Head, Font, Preview, Container } from '@react-email/components';
import { colors, screens, themeDefaults, spacing } from './theme';

type BaseLayoutProps = {
	width: number;
	children: React.ReactNode;
	preview?: string;
};

export default function BaseLayout({ width, children, preview }: BaseLayoutProps) {
	return (
		<Html>
			<Head>
				{preview && <Preview>{preview}</Preview>}
				<meta name='color-scheme' content='dark' />
				<meta name='supported-color-schemes' content='dark' />

				<Font
					fontFamily='Inter'
					fallbackFontFamily={'Arial'}
					webFont={{
						format: 'woff2',
						url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700',
					}}
				/>
				<Font
					fontFamily='Indivisible'
					fallbackFontFamily={'Arial'}
					webFont={{
						format: 'woff2',
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/fonts/IndivisibleWebMedium.woff2`,
					}}
				/>
				<style>{`

          body {
            -webkit-font-smoothing: antialiased;
            background: ${colors.black};
            font-family: ${themeDefaults.fontFamily};
            line-height: ${themeDefaults.lineHeight};
            font-weight: ${themeDefaults.fontWeight};
            font-size: ${themeDefaults.fontSize};
            color: ${themeDefaults.color};
            padding: ${themeDefaults.padding};
          }

          .ExternalClass p, 
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td {
            line-height: 100%
          } 
            
          table, td {
            -webkit-font-smoothing: antialiased;
            background: ${colors.black};
            color: ${colors.white};
          }

          span {
            color: ${colors.white} !important;
          }

          p {
            margin: 0 !important;
          }

          a,
          a[href],
          a:link,
          a:visited {
            color: ${colors.white} !important;
            text-decoration: underline !important;
            text-decoration-color: ${colors.white} !important;
            text-underline-offset: 2px;
          }
          
          a:hover {
            color: ${colors.white} !important;
            text-decoration-color: ${colors.white} !important;
          }
          
          .text a,
          .text a[href],
          .text a:link,
          .text a:visited {
            color: ${colors.white} !important;
            text-decoration: underline !important;
            text-decoration-color: ${colors.white} !important;
            text-underline-offset: 2px;
          }
          .gutter {
            padding-left: ${spacing.s7}px;
            padding-right: ${spacing.s7}px;
          }
          .margin {
            padding-left: ${spacing.s7}px !important;
            padding-right: ${spacing.s7}px !important;
          }
          .green td {
            background: ${colors.green} !important;
          }
          .padding {
            padding-left: ${spacing.s7}px !important;
            padding-right: ${spacing.s7}px !important;
          }
          }
          .no-wrap {
            white-space: nowrap;
          }
          .dark-mode {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }
          .hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }
          .lg-hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }

          @media (min-width:${screens.xs}) {
            .lg-gutter {
              padding-left: ${spacing.s7}px !important;
              padding-right: ${spacing.s7}px !important;
            }

            .margin {
              padding-left: ${spacing.s12}px !important;
              padding-right: ${spacing.s12}px !important;
            }

            .sm-hidden {
              display: none;
              max-width: 0px;
              max-height: 0px;
              overflow: hidden;
              mso-hide: all;
            }

            .lg-hidden {
              display: block !important;
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
              mso-hide: none !important;
            }
          }
      `}</style>
			</Head>
			<Body style={{ backgroundColor: colors.black }} className='body'>
				<Container style={{ maxWidth: width, margin: '0 auto', width: '100%' }} align='center'>
					{children}
				</Container>
			</Body>
		</Html>
	);
}

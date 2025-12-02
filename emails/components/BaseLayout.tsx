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
				<meta name='color-scheme' content='light' />
				<meta name='supported-color-schemes' content='light' />

				<Font
					fontFamily='Arial'
					fallbackFontFamily='Arial'
					webFont={{
						format: 'woff2',
						url: `${process.env.NEXT_PUBLIC_SITE_URL}/fonts/KKV_Regular.woff2`,
					}}
				/>

				<style>{`
          @font-face {
            font-family: "Arial";
            src: url("${process.env.NEXT_PUBLIC_SITE_URL}/fonts/KKV_Regular.woff2") format("woff2");
            font-weight: normal;
            font-style: normal;
          }

          @font-face {
            font-family: "Arial";
            src: url("${process.env.NEXT_PUBLIC_SITE_URL}/fonts/KKV_Italic.woff2") format("woff2");
            font-weight: normal;
            font-style: italic;
          }

          @font-face {
            font-family: "Arial";
            src: url("${process.env.NEXT_PUBLIC_SITE_URL}/fonts/KKV_Bold.woff2") format("woff2");
            font-weight: bold;
            font-style: normal;
          }

          @font-face {
            font-family: "Arial";
            src: url("${process.env.NEXT_PUBLIC_SITE_URL}/fonts/KKV_BoldItalic.woff2") format("woff2");
            font-weight: bold;
            font-style: italic;
          }

          body {
            -webkit-font-smoothing: antialiased;
            background: ${colors.white};
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
            background: ${colors.white};
            color: ${colors.black};
          }

          span {
            color: ${colors.black} !important;
          }
          
          button,
          .light-mode,
          .light-mode span,
          .light-mode a {
            color: ${colors.white} !important;
          }

          p {
            margin: 0 !important;
            padding-top: 0 !important;
          }
          
          .text {
            padding-top: 0 !important;
          }

          a,
          a[href],
          a:link,
          a:visited {
            color: ${colors.black} !important;
            text-decoration: underline !important;
            text-decoration-color: ${colors.black} !important;
            text-underline-offset: 2px;
          }
          
          a:hover {
            color: ${colors.black} !important;
            text-decoration-color: ${colors.black} !important;
          }
          
          .text a,
          .text a[href],
          .text a:link,
          .text a:visited {
            color: ${colors.black} !important;
            text-decoration: underline !important;
            text-decoration-color: ${colors.black} !important;
            text-underline-offset: 2px;
          }
          
          .text.footer-link a,
          .text.footer-link a[href],
          .text.footer-link a:link,
          .text.footer-link a:visited,
          .text.footer-link a:hover,
          .text.footer-link a:active,
          .footer-link.text a,
          .footer-link.text a[href],
          .footer-link.text a:link,
          .footer-link.text a:visited,
          .footer-link.text a:hover,
          .footer-link.text a:active,
          .footer-link a,
          .footer-link a[href],
          .footer-link a:link,
          .footer-link a:visited,
          .footer-link a:hover,
          .footer-link a:active,
          td .text.footer-link a,
          td .text.footer-link a[href],
          td .text.footer-link a:link,
          td .text.footer-link a:visited,
          td .text.footer-link a:hover,
          td .text.footer-link a:active,
          td .footer-link.text a,
          td .footer-link.text a[href],
          td .footer-link.text a:link,
          td .footer-link.text a:visited,
          td .footer-link.text a:hover,
          td .footer-link.text a:active,
          td .footer-link a,
          td .footer-link a[href],
          td .footer-link a:link,
          td .footer-link a:visited,
          td .footer-link a:hover,
          td .footer-link a:active,
          table .footer-link a,
          table .footer-link a[href],
          table .footer-link a:link,
          table .footer-link a:visited,
          .footer-link-item,
          .footer-link-item[href],
          .footer-link-item:link,
          .footer-link-item:visited,
          .footer-link-item:hover,
          .footer-link-item:active,
          .text .footer-link-item,
          .text .footer-link-item[href],
          .text .footer-link-item:link,
          .text .footer-link-item:visited,
          .text .footer-link-item:hover,
          .text .footer-link-item:active,
          .text.footer-link .footer-link-item,
          .text.footer-link .footer-link-item[href],
          .text.footer-link .footer-link-item:link,
          .text.footer-link .footer-link-item:visited {
            text-decoration: none !important;
            text-decoration-color: transparent !important;
            text-underline-offset: 0 !important;
            border-bottom: none !important;
            border: none !important;
            outline: none !important;
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
			<Body style={{ backgroundColor: colors.white }} className='body'>
				<Container style={{ maxWidth: width, margin: '0 auto', width: '100%' }} align='center'>
					{children}
				</Container>
			</Body>
		</Html>
	);
}

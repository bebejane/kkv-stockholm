'use client';

import { MantineColorsTuple, createTheme, Button } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';

const yellow: MantineColorsTuple = [
	'#fffde1',
	'#fff9cb',
	'#fff29a',
	'#ffea64',
	'#ffe438',
	'#ffe01d',
	'#ffdd00',
	'#e3c500',
	'#caaf00',
	'#ae9600',
];

export const theme = createTheme({
	fontSmoothing: true,
	white: 'var(--white)',
	black: 'var(--black)',
	primaryColor: 'yellow',
	fontFamily: 'var(--body-font)',
	headings: {
		fontFamily: 'var(--headline-font)',
	},
	defaultRadius: 2,
	spacing: {
		xs: '0.5rem',
		sm: '0.75rem',
		md: '1rem',
		lg: '1.25rem',
		xl: '1.5rem',
		xxl: '2rem',
	},
	components: {
		Button: Button.extend({
			defaultProps: {
				color: 'yellow',
				variant: 'outline',
				radius: 'xl',
			},
			styles: {
				label: {
					fontSize: '0.8rem',
				},
				root: {
					color: 'black',
				},
			},
		}),
		RichTextEditor: RichTextEditor.extend({
			defaultProps: {
				styles: {
					toolbar: {
						//color: 'black',
					},
				},
			},
		}),
	},
	colors: {
		yellow,
	},
});

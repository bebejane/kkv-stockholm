'use client';

import { MantineColorsTuple, createTheme, Button, Input, TextInput } from '@mantine/core';
//import { RichTextEditor } from '@mantine/tiptap';

const purple: MantineColorsTuple = [
	'#3A29A6',
	'#4E3EAF',
	'#6154B8',
	'#7569C1',
	'#897FCA',
	'#9D94D3',
	'#B0A9DB',
	'#C4BFE4',
	'#D8D4ED',
	'#EBEAF6',
	'#FFFFFF',
];

export const theme = createTheme({
	fontSmoothing: true,
	white: 'var(--white)',
	black: 'var(--black)',
	primaryColor: 'purple',
	fontFamily: 'var(--body-font)',
	headings: {
		fontFamily: 'var(--headline-font)',
	},
	defaultRadius: 0,
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
				color: 'purple',
				variant: 'filled',
				radius: 0,
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
		TextInput: TextInput.extend({
			defaultProps: {
				color: 'purple',
				variant: 'filled',
			},
			styles: {},
		}),
		Input: Input.extend({
			defaultProps: {
				variant: 'filled',
			},
		}),
	},
	colors: {
		purple,
	},
});

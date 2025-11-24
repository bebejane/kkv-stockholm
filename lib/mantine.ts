'use client';

import { MantineColorsTuple, createTheme, Button, Input, TextInput, MultiSelect, Select } from '@mantine/core';
//import { RichTextEditor } from '@mantine/tiptap';

const primary: MantineColorsTuple = [
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
	'#3a29a6',
];

const primaryLight: MantineColorsTuple = [
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
	'#9f96d9',
];

export const theme = createTheme({
	fontSmoothing: true,
	white: '#fcfcfc',
	black: '#161616',
	primaryColor: 'primary',
	fontFamily: 'Arial, Helvetica, Sans-Serif',
	headings: {
		fontFamily: 'Arial, Helvetica, Sans-Serif',
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
	colors: {
		primary,
		primaryLight,
	},
	focusRing: 'never',
	components: {
		Button: Button.extend({
			defaultProps: {
				variant: 'filled',
				radius: '5px',
			},

			styles: {
				label: {
					fontSize: '0.8rem',
					fontStyle: 'normal',
					fontWeight: 'normal',
				},
				root: {},
			},
		}),
		TextInput: TextInput.extend({
			defaultProps: {
				color: 'primaryLight',
				variant: 'filled',
			},
			styles: {
				label: {
					fontSize: '0.8rem',
				},
				input: {
					backgroundColor: '#F4F3FE',
				},
			},
		}),
		Input: Input.extend({
			defaultProps: {
				variant: 'filled',
			},
		}),
		Select: Select.extend({
			styles: {
				input: {
					backgroundColor: '#F4F3FE',
				},
				dropdown: {
					borderColor: '#F4F3FE',
				},
				option: {},
			},
		}),
		MultiSelect: MultiSelect.extend({
			styles: {
				input: {
					backgroundColor: '#F4F3FE',
				},
			},
		}),
	},
});

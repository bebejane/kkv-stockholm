'use client';

import {
	MantineColorsTuple,
	createTheme,
	Button,
	Input,
	TextInput,
	MultiSelect,
	Select,
} from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
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
		DatePicker: Input.extend({
			styles: {},
		}),
		Select: Select.extend({
			styles: {
				input: {
					backgroundColor: '#F4F3FE',
				},
				dropdown: {
					borderColor: '#3a29a6',
					backgroundColor: '#F4F3FE',
				},
				options: {
					borderColor: '#F4F3FE',
					accentColor: '#F4F3FE',
				},
			},
		}),
		MultiSelect: MultiSelect.extend({
			styles: {
				input: {
					backgroundColor: '#F4F3FE',
				},
				dropdown: {
					borderColor: '#3a29a6',
					backgroundColor: '#F4F3FE',
				},
				options: {
					borderColor: '#F4F3FE',
					accentColor: '#F4F3FE',
				},
			},
		}),
		DatePickerInput: DatePickerInput.extend({
			styles: {
				input: {
					backgroundColor: '#F4F3FE',
				},
				wrapper: {
					backgroundColor: '#F4F3FE',
				},
			},
		}),
	},
});

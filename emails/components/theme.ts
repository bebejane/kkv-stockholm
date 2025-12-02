import { CSSProperties } from 'react';

export const colors = {
	black: '#161616',
	white: '#fcfcfc',
	green: '#1b5b44',
	neutral100: '#F5F5F5',
	neutral200: '#EEE',
	neutral400: '#888',
	neutral500: '#777',
	neutral600: '#666',
	neutral800: '#444',
	transparent: 'transparent',
};

export const fontSize = {
	xs: 12,
	sm: 12,
	base: 17,
	lg: 24,
	xl: 30,
};

export const lineHeight = {
	tight: '125%',
	relaxed: '140%',
};

export const fontWeight = {
	normal: 400,
	bold: 700,
};

export const letterSpacing = {
	normal: '0em',
	wide: '.1em',
};

export const textTransform: Record<string, CSSProperties['textTransform']> = {
	normal: 'none',
	big: 'uppercase',
};

export const borderRadius = {
	base: 100,
	full: 9999,
};

export const textAlign = {
	left: 'left',
	right: 'right',
};

export const fontFamily = {
	sans: '"Arial"',
};

export const spacing = {
	s0: 0,
	s1: 4,
	s3: 8,
	s4: 12,
	s5: 16,
	s6: 20,
	s7: 24,
	s8: 32,
	s9: 40,
	s10: 48,
	s11: 56,
	s12: 72,
};

export const screens = {
	xs: '480px',
	sm: '640px',
};

export const themeDefaults: Record<string, string | number> = {
	fontFamily: fontFamily.sans,
	lineHeight: lineHeight.relaxed,
	fontWeight: fontWeight.normal,
	fontSize: fontSize.base,
	color: colors.black,
	padding: 0,
};

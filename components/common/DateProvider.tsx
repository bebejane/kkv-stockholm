'use client';

import 'dayjs/locale/sv';
import { DatesProvider } from '@mantine/dates';

export function DateProvider({ children }: { children: React.ReactNode }) {
	return <DatesProvider settings={{ locale: 'sv' }}>{children}</DatesProvider>;
}

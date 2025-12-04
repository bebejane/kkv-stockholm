'use client';

import { Button } from '@mantine/core';
import Link from 'next/link';
import { authClient } from '@/auth/auth-client';

export function BookingButton({ workshop }: { workshop: string }) {
	const { data, isPending, isRefetching } = authClient.useSession();
	const disabled = !data?.user?.id && !isPending ? true : false;

	return (
		<Link href={`/medlem/bokningar/ny?wid=${workshop}`}>
			<Button>Boka</Button>
		</Link>
	);
}

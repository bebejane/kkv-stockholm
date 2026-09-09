'use client';

import s from './WorkshopContact.module.scss';
import cn from 'classnames';
import { authClient } from '@/auth/auth-client';

export default function WorkshopContact({ email }: { email?: string }) {
	const { data, isPending, isRefetching } = authClient.useSession();

	if (!email || !data?.user?.id) return null;

	return (
		<section className={cn('margin-right margin-bottom line', s.email)}>
			<h2>Avdelninsansvarig</h2>
			Hör av dig till <a href={`mailto:${email}`}>{email}</a> om du har frågor.
		</section>
	);
}

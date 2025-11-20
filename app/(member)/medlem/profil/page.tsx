import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import { ProfileForm } from '@/components/forms';
import { AllWorkshopsDocument, MemberDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';

export default async function Profile({}: PageProps<'/medlem/profil'>) {
	const { user } = await getSession();
	const { member } = await apiQuery(MemberDocument, {
		revalidate: 0,
		variables: { email: user.email },
	});

	if (!member) return notFound();

	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });

	return (
		<article>
			<h1>Profil</h1>
			<ProfileForm member={member} allWorskhops={allWorkshops} />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/profil'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Profil`,
		pathname: `/medlem/profil`,
	});
}

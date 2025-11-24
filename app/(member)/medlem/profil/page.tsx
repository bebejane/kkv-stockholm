import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { MemberProfileForm } from '@/components/forms/MemberProfileForm';
import { AllWorkshopsDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';

export default async function ProfilePage({}: PageProps<'/medlem/profil'>) {
	const { member } = await getMemberSession();
	if (!member) return notFound();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true, revalidate: 0 });

	return (
		<article>
			<h1>Profil</h1>
			<MemberProfileForm member={member} allWorkshops={allWorkshops} />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/profil'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Profil`,
		pathname: `/medlem/profil`,
	});
}

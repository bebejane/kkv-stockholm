import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import { ProfileForm } from '@/components/forms';
import { AllWorkshopsDocument, MemberDocument } from '@/graphql';
import { getMember } from '@/lib/controller/member';
import { getAllWorkshops } from '@/lib/controller/workshop';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';

export default async function Profile({}: PageProps<'/medlem/profil'>) {
	const { user } = await getSession();
	const member = await getMember(user.email);
	if (!member) return notFound();

	const workshops = await getAllWorkshops();

	return (
		<article>
			<h1>Profil</h1>
			<ProfileForm member={member} workshops={workshops} />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/profil'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Profil`,
		pathname: `/medlem/profil`,
	});
}

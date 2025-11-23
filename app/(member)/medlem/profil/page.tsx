import { buildMetadata } from '@/app/(website)/layout';
import { getMemberSession } from '@/auth/utils';
import { MemberProfileForm } from '@/components/forms/MemberProfileForm';
import * as workshopController from '@/lib/controller/workshop';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function ProfilePage({}: PageProps<'/medlem/profil'>) {
	const { member } = await getMemberSession();
	if (!member) return notFound();
	const workshops = await workshopController.findAll();

	return (
		<article>
			<h1>Profil</h1>
			<MemberProfileForm member={member} workshops={workshops} />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/profil'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Profil`,
		pathname: `/medlem/profil`,
	});
}

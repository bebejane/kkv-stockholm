import { getMemberSession } from '@/auth/utils';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function ProfilePage({}: PageProps<'/medlem/profil'>) {
	const { member } = await getMemberSession();
	if (!member) return notFound();

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<ProfileForm member={member} />
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Profil',
};

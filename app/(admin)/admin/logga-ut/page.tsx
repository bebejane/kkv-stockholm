import { AdminLogoutForm } from './AdminLogoutForm';
import { buildMetadata } from '@/app/(website)/layout';
import { Metadata } from 'next';

export default async function AdminLogoutPage() {
	return <AdminLogoutForm />;
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Logga ut - Admin',
		pathname: '/admin/logga-ut',
	});
}

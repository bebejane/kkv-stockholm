import PageLoading from '@/components/common/PageLoading';
import { metadata } from './page';

export default function Loading() {
	return <PageLoading title={metadata.title as string} />;
}
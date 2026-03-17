import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument } from '@/graphql';
import { Plugin } from './Plugin';

export default async function PluginPage() {
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });
	return <Plugin allWorkshops={allWorkshops} />;
}

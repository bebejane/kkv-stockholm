import { fetchAllPages } from './client';
import { SpirisArticle } from './types';

export async function findArticlesByNames(
	names: string[],
): Promise<Map<string, SpirisArticle>> {
	if (names.length === 0) return new Map();
	const articles = await fetchAllPages<SpirisArticle>('/articles');

	const result = new Map<string, SpirisArticle>();
	for (const article of articles) {
		if (names.includes(article.Name)) {
			result.set(article.Name, article);
		}
	}
	return result;
}

import { spirisFetch } from './client';
import { PaginatedResponse, SpirisArticle } from './types';

export async function findArticlesByNames(
	names: string[],
): Promise<Map<string, SpirisArticle>> {
	if (names.length === 0) return new Map();
	const response = await spirisFetch<PaginatedResponse<SpirisArticle>>('/articles');

	const result = new Map<string, SpirisArticle>();
	for (const article of response.Data) {
		if (names.includes(article.Name)) {
			result.set(article.Name, article);
		}
	}
	return result;
}

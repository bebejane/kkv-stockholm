import { spirisFetch } from './client';
import { PaginatedResponse, SpirisCustomer } from './types';

export async function findCustomerByEmail(
	email: string,
): Promise<SpirisCustomer | null> {
	const response = await spirisFetch<PaginatedResponse<SpirisCustomer>>(
		`/customers?$filter=contains(EmailAddress,'${encodeURIComponent(email)}')`,
	);

	const customer = response.value.find(
		(c) => c.EmailAddress?.toLowerCase() === email.toLowerCase(),
	);

	return customer ?? null;
}

export async function findCustomerById(
	id: string,
): Promise<SpirisCustomer> {
	return spirisFetch<SpirisCustomer>(`/customers/${id}`);
}

export async function createCustomer(
	data: Omit<SpirisCustomer, 'Id'>,
): Promise<SpirisCustomer> {
	return spirisFetch<SpirisCustomer>('/customers', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function updateCustomer(
	id: string,
	data: Partial<SpirisCustomer>,
): Promise<SpirisCustomer> {
	return spirisFetch<SpirisCustomer>(`/customers/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
}

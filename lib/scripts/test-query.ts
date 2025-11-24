import 'dotenv/config';
import { apiQuery } from 'next-dato-utils/api';
import { AllBookingsSearchDocument } from '@/graphql';
import { bookingSearchSchema } from '@/lib/schemas';

async function test() {
	try {
		const variables = bookingSearchSchema.parse({
			start: '2025-12-10T00:00:00Z',
			end: '2025-12-26T01:00:00Z',
			//workshopId: 'ONyWnxWHT_upqf_cbueGAQ',
			//equipmentId: 'H-WJ-PuOS_-KuTp2yZqTyw',
		});

		const { allBookings } = await apiQuery(AllBookingsSearchDocument, {
			all: true,
			variables,
		});

		console.log(allBookings.length);
	} catch (e) {
		console.log(e);
	}
}

test();

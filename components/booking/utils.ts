export function transformData(data: any) {
	const records: any[] = new Array(24).fill({});
	return records.map((row, i) => {
		return data.map((d: any) => d.hours[i]);
	});
}

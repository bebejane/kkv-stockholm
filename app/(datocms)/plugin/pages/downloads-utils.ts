'use client';

export type DownloadOption = {
	url: string;
	filename: string;
	label: string;
};

export async function downloadFile(url: string, filename: string, token: string) {
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
	const blob = await res.blob();
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	link.click();
	URL.revokeObjectURL(link.href);
}

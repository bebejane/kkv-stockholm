import * as Components from './blocks';

export type BlockProps = { data: any; onClick?: Function };

export default function Block({ data, onClick }: BlockProps) {
	const type = data.__typename.replace('Record', '');
	const BlockComponent = Components[type as keyof typeof Components];

	if (!BlockComponent) {
		console.warn(`No block component found for type ${type}`);
		return null;
	}

	return <BlockComponent data={data} onClick={onClick} />;
}

import * as Components from './';

export type BlockProps = { data: any; onClick?: Function };

export default function Block({ data, onClick }: BlockProps) {
	const type = data.__typename.replace('Record', '');
	const BlockComponent = Components[type];

	if (!BlockComponent) return <div>No block match {data.__typename}</div>;

	return <BlockComponent data={data} onClick={onClick} />;
}

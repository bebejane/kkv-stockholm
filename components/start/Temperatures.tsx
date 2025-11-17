import s from './Temperatures.module.scss';
import { sleep } from 'next-dato-utils/utils';
import Link from 'next/link';

const data = [
	{
		name: 'Gasugn 1',
		temperature: 75.0,
	},
	{
		name: 'Gasugn 2',
		temperature: 149.0,
	},
	{
		name: 'Bronsugn 1',
		temperature: 149.0,
	},
	{
		name: 'Bronsugn 2',
		temperature: 18.0,
	},
];

export async function Temperatures() {
	await sleep(2000);

	return (
		<ul className={s.temperatures}>
			{data.map(({ name, temperature }) => (
				<li key={name}>
					<span>{name}</span>
					<span>{temperature}</span>
				</li>
			))}
		</ul>
	);
}

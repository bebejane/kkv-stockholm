'use client';

import s from './index.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button, Input, Box } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

const columns = [];

export type CalenderProps = {
	data: [
		{
			start: Date;
			end: Date;
			b: BookingRecord | null;
		},
	];
};

export function Calender({ data }: CalenderProps) {
	return (
		<div className={s.calendar}>
			<DataTable
				withTableBorder
				borderRadius='sm'
				withColumnBorders
				striped
				highlightOnHover
				records={[{ id: 1, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' }]}
				columns={[
					{
						accessor: 'id',
						title: '#',
						textAlign: 'right',
					},
					{ accessor: 'name' },
					{
						accessor: 'party',
						// this column has custom cell data rendering
						render: ({ party }) => (
							<Box fw={700} c={party === 'Democratic' ? 'blue' : 'red'}>
								{party.slice(0, 3).toUpperCase()}
							</Box>
						),
					},
					{ accessor: 'bornIn' },
				]}
				// execute this callback when a row is clicked
				onRowClick={({ record: { name, party, bornIn } }) => {
					console.log('row click');
				}}
			/>
		</div>
	);
}

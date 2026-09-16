import React from 'react';
import s from './WorkshopPriceSection.module.scss';
import cn from 'classnames';

export function WorkshopPriceSection({
	workshop,
	fullWidth,
}: {
	workshop: WorkshopQuery['workshop'];
	fullWidth?: boolean;
}) {
	if (!workshop) return null;
	const {
		priceDay,
		priceDayHide,
		priceHour,
		priceHourHide,
		priceMonth,
		priceMonthHide,
		priceWeek,
		priceWeekHide,
	} = workshop;

	return (
		<section className={cn('margin-bottom line', !fullWidth && 'margin-right', s.prices)}>
			<h2>Priser</h2>
			<div className='content-grid mid'>
				{priceHour > 0 && !priceDayHide && (
					<>
						<span className={s.label}>Timme:</span> <span className={s.value}>{priceHour} kr</span>
					</>
				)}
				{priceDay > 0 && !priceHourHide && (
					<>
						<span className={s.label}>Dag:</span> <span className={s.value}>{priceDay} kr</span>
					</>
				)}
				{priceMonth > 0 && !priceMonthHide && (
					<>
						<span className={s.label}>Månad:</span> <span className={s.value}>{priceMonth} kr</span>
					</>
				)}
				{priceWeek > 0 && !priceWeekHide && (
					<>
						<span className={s.label}>Vecka:</span> <span className={s.value}>{priceWeek} kr</span>
					</>
				)}
				{workshop?.equipment
					?.filter(({ price }) => price)
					.map(({ title, price }) => (
						<React.Fragment key={title}>
							<span className={s.label}>{title}</span>
							<span className={s.long}>{price}</span>
						</React.Fragment>
					))}
			</div>
		</section>
	);
}

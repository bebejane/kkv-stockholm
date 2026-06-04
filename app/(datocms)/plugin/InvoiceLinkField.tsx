'use client';

import { Canvas } from 'datocms-react-ui';

import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';

type PropTypes = {
	ctx: RenderFieldExtensionCtx;
};

const SPIRIS_INVOICE_URL = 'https://eaccounting.vismaonline.com/#/sales/customerinvoice';

export function InvoiceLinkField({ ctx }: PropTypes) {
	const invoiceId = ctx.formValues?.invoice_id as string | undefined;

	if (!invoiceId) return null;

	return (
		<Canvas ctx={ctx}>
			<a href={`${SPIRIS_INVOICE_URL}/${invoiceId}`} target='_blank' rel='noopener noreferrer'>
				Open in Spiris ↗
			</a>
		</Canvas>
	);
}

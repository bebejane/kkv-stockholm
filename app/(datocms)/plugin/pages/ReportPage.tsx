import { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
	ctx: RenderPageCtx;
};

export function ReportPage({ ctx }: PropTypes) {
	return <Canvas ctx={ctx}>Reports, kommer snart...</Canvas>;
}

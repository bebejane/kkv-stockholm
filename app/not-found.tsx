import Error from './error';

export default function NotFound() {
	return <Error message={'Not found'} code={404} />;
}

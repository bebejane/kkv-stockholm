import Error from './error';

export default function NotFound() {
	return <Error message={'Sidan hittades inte'} code={404} />;
}

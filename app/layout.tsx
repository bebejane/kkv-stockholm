export default async function DatocmsLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang='sv-SE'>
			<body id='root'>{children}</body>
		</html>
	);
}

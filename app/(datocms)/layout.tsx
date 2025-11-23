export default async function DatocmsLayout({ children }: LayoutProps<'/'>) {
	return (
		<>
			<html>
				<body id='root'>{children}</body>
			</html>
		</>
	);
}

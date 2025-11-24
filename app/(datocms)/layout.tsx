export default async function DatocmsLayout({ children }: LayoutProps<'/'>) {
	return (
		<html>
			<body id='root' style={{ margin: 0, padding: 0 }}>
				{children}
			</body>
		</html>
	);
}

'use client';
import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import React, {ReactNode} from "react";

export default function RootLayout({
									   children,
								   }: {
	children: ReactNode
}) {
	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});
	return (
		<ThemeProvider theme={darkTheme}>
				<CssBaseline/>
				<html lang="en">
				<head>
					<meta charSet="UTF-8"/>
					<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
					<title>Cosmic-Comics</title>
				</head>
				<body>{children}
				<div id="toast-container"></div>
				</body>

				</html>
		</ThemeProvider>
	);
}

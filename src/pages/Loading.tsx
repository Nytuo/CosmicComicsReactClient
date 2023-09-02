import StarBackground from "@/components/StarBackground.tsx";
import { CircularProgress, Grid } from "@mui/material";
import { useEffect, useLayoutEffect } from "react";

export function Loading() {
	useEffect(() => {
		document.title = "Loading...";
		setTimeout(() => {
			window.location.href = "/login";
		}, 1500);
	});
	useLayoutEffect(() => {
		document.querySelector("#navbar")?.classList.add("hidden");
	}, []);
	return (
		<>
			<StarBackground />
			<Grid
				container
				spacing={5}
				direction="column"
				alignItems="center"
				justifyContent="center"
				sx={{ minHeight: '100vh' }}
			>
				<Grid item xs={3}>
					<img src="Images/Logo.png" alt="" width="auto" height="180px" id="logo_id"
						className="navbar-brand rotate linear infinite" /><img src="Images/LogoTxt.png" alt="" id="logo_id_txt" height="180px" className="navbar-brand" />
				</Grid>
				<Grid item xs={3}>
					<CircularProgress />
				</Grid>
			</Grid >
		</>
	);
}
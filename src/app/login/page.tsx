"use client";
import {useEffect, useLayoutEffect, useState} from "react";
import {Button} from "@mui/material";
import LoginDialog from "@/components/LoginDialog";
import CreateAccountDialog from "@/components/CreateAccountDialog";
import IProfile from "@/utils/IProfile";
import {PDP, setCookie} from "@/utils/common";

export default function Login() {
	function createStarBackground(numStars: number, animDelay: number) {
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		const starsContainer = document.createElement('div');
		starsContainer.classList.add('stars-container');
		for (let i = 0; i < numStars; i++) {
			const star = document.createElement('div');
			star.classList.add('star');
			star.style.animationName = "starAnimation";
			star.style.animationDelay = `${Math.random() * animDelay}s`;
			star.style.animationDuration = `${(Math.random() * animDelay + 1) / 1.25}s`;
			star.style.animationIterationCount = 'infinite';
			// Generate random position within screen limits
			const x = (Math.random() * screenWidth);
			const y = (Math.random() * screenHeight);
			star.style.left = `${x}px`;
			star.style.top = `${y}px`;
			starsContainer.appendChild(star);
		}
		document.querySelector("body")?.appendChild(starsContainer);
	}

	useLayoutEffect(() => {
		createStarBackground(200, 120);
	}, []);
	const [openLogin, setOpenLogin] = useState(false);
	const [openCreateAccount, setOpenCreateAccount] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState<IProfile | undefined>();
	const [profiles, setProfiles] = useState<IProfile[]>([]);
	const onLoginModalClose = () => {
		setOpenLogin(false);
	};
	const servConfig = (name: HTMLInputElement, pass: HTMLInputElement, aport: HTMLInputElement): void => {
		setOpenCreateAccount(false);
		fetch(PDP + "/configServ/" + name.value + "/" + pass.value + "/" + aport.value, {method: 'POST'}).then(() => {
			discover();
		});
	};
	useEffect(() => {
		discover();
	}, []);
	const discover = (): void => {
		fetch(PDP + "/profile/discover", {cache: 'no-store'}).then(function (response) {
			return response.text();
		}).then(async function (fetchedData: string) {
				console.log(fetchedData);
				const data = JSON.parse(fetchedData);
				if (data.length === 0) {
					setOpenCreateAccount(true);
					return;
				}
				setProfiles(data);
			},
		).catch(function (error) {
			console.log(error);
		});
	};
	return (
		<>
			<div style={{marginTop: "100px", textAlign:'center', width: "100%"}}>
				<h1 id="whosreading">Who's reading
					?</h1>
			</div>
			<div id="login_discover">
				{profiles.map((profile, index) => {
					return (
						<div onClick={
							() => {
								if (profile.passcode) {
									console.log("login");
									setSelectedProfile(profile);
									setOpenLogin(true);
								} else {
									setCookie('selectedProfile', profile.name, 2, document);
									window.location.href = "/collectionner";
								}
							}
						} key={index} className="login_elements">
							<img src={profile.image} className="profile_image" alt={profile.name}/>
							<h3>{profile.name}</h3>
						</div>
					);
				})}
			</div>
			<LoginDialog openModal={openLogin} onClose={onLoginModalClose} title={"Login"}
						 text={"Please enter your password to continue"} okBtn={"login"} cancelBtn={"Cancel"}
						 profile={selectedProfile}/>
			<CreateAccountDialog openModal={openCreateAccount} title={"First time configuration of the server"}
								 text={"Please create the first account to continue : "} okBtn={"login"}
								 createFunction={servConfig}/>
		</>
	);
}

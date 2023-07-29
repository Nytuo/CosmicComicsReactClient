import React from 'react';
import IProfile from '@/utils/IProfile.ts';
import { setCookie } from '@/utils/Common.ts';
export function LoginCard({ profile, key, setOpenLogin, setSelectedProfile }: { profile: IProfile, key: number, setOpenLogin: React.Dispatch<React.SetStateAction<boolean>>, setSelectedProfile: React.Dispatch<React.SetStateAction<IProfile | undefined>>; }) {
	return (
		<>
			<div onClick={
				() => {
					if (profile.passcode) {
						setSelectedProfile(profile);
						setOpenLogin(true);
					} else {
						setCookie('selectedProfile', profile.name, 2, document);
						window.location.href = "/collectionner";
					}
				}
			} key={key} className="login_elements">
				<img src={profile.image} className="profile_image" alt={profile.name} />
				<h3>{profile.name}</h3>
			</div>
		</>
	);
}

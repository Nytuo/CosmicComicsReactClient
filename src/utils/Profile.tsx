import { Toaster } from "@/components/Toaster.tsx";
import { PDP } from "./Common.ts";
import Logger from "@/logger.ts";
import { tryToParse } from "./utils.ts";

export default class Profile {
	private _token: string;
	private _name: string;
	private _pp: string;

	constructor(token: string) {
		this._token = token;
		this._name = "Unknown";
		this._pp = PDP + "/profile/getPP/" + this._token;

	}

	/**
	 * Create an account on the server
	 */
	async createAccount(username: string, password: string, pp: string) {
		const accountsNames: string[] = [];
		fetch(PDP + "/profile/discover").then(function (response) {
			return response.text();
		}).then(async function (data) {
			const parsedData = tryToParse(data);
			parsedData.forEach(function (item: any) {
				accountsNames.push(item.name.toLowerCase());
			});
		});
		if (!accountsNames.includes(username.toLowerCase())) {
			const option = {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
					"token": this._token,
					"name": username,
					"password": password,
					"pp": pp
				}, null, 2)
			};
			fetch(PDP + "/createUser", option).then(() => {
				Toaster("Account created !", "success");
			});
		} else {
			Toaster("Account already exists !", "error");
		}
	}

	/**
	 * Delete the account
	 */
	async DeleteAccount() {
		const option = {
			method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
				"token": this._token
			}, null, 2)
		};
		fetch(PDP + "/profile/deleteAccount", option).then(() => {
			Toaster("Account deleted !", "success");
		}).catch((err) => {
			Toaster("Error", "error");
			Logger.error(err);
		});
		window.location.href = 'login';
	}
	/**
	 * Download the database
	 */
	DownloadBDD() {
		window.open(PDP + "/profile/DLBDD/" + this._token);
	}

	/**
	 * Modify the account
	 * @param {{form: (*|HTMLElement)[]}} forma The form to get the data (The HTML element)
	 */
	async modifyAccount(username: string, password: string, pp: string) {
		let nuser: string | null = username;
		let npass: string | null = password;
		let npp: string | null = pp;
		if (username === "") {
			nuser = null;
		}
		if (password === "") {
			npass = null;
		}
		if (pp.length === 0 && pp == null) {
			npp = null;
		}
		const options = {
			method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
				"nuser": nuser, "npass": npass, "npp": npp, "token": this._token
			}, null, 2)
		};
		await fetch(PDP + "/profile/modification", options);
	}

	set setName(name: string) {
		this._name = name;
	}

	get getName() {
		return this._name;
	}

	set setPP(pp: string) {
		this._pp = pp;
	}

	get getPP() {
		return this._pp;
	}

	get getToken() {
		return this._token;
	}
}
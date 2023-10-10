import {ToasterHandler} from "@/components/common/ToasterHandler.tsx";
import {PDP} from "./Common.ts";
import Logger from "@/logger.ts";
import {tryToParse} from "./utils.ts";
import {t} from "i18next";

export default class Profile {
    private readonly _token: string;
    private _name: string;
    private readonly _pp: string;

    constructor(token: string) {
        this._token = token;
        this._name = t("unknown");
        this._pp = PDP + "/profile/getPP/" + this._token;

    }

    set setName(name: string) {
        this._name = name;
    }

    get getName() {
        return this._name;
    }
    get getPP() {
        return this._pp;
    }

    get getToken() {
        return this._token;
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
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    "token": this._token,
                    "name": username,
                    "password": password,
                    "pp": pp
                }, null, 2)
            };
            fetch(PDP + "/createUser", option).then(() => {
                ToasterHandler("Account created !", "success");
            });
        } else {
            ToasterHandler("Account already exists !", "error");
        }
    }

    /**
     * Delete the account
     */
    async DeleteAccount() {
        const option = {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                "token": this._token
            }, null, 2)
        };
        fetch(PDP + "/profile/deleteAccount", option).then(() => {
            ToasterHandler("Account deleted !", "success");
        }).catch((err) => {
            ToasterHandler("Error", "error");
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
     * @param username the new username
     * @param password the new password
     * @param pp the new profile picture
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
        if (pp.length === 0) {
            npp = null;
        }
        const options = {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                "nuser": nuser, "npass": npass, "npp": npp, "token": this._token
            }, null, 2)
        };
        await fetch(PDP + "/profile/modification", options);
    }
}
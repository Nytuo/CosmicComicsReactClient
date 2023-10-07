import { useEffect, useLayoutEffect, useState } from "react";
import LoginDialog from "@/components/Dialogs/LoginDialog.tsx";
import CreateAccountDialog from "@/components/Dialogs/CreateAccountDialog.tsx";
import IProfile from "@/interfaces/IProfile";
import { PDP } from "@/utils/Common.ts";
import { LoginCard } from "@/components/LoginCard.tsx";
import StarBackground from "@/components/StarBackground.tsx";
import { ToasterHandler } from "@/components/ToasterHandler.tsx";
import { useTranslation } from "react-i18next";
import { Container, useTheme } from "@mui/material";
export default function Login() {
    const [openLogin, setOpenLogin] = useState(false);
    const [openCreateAccount, setOpenCreateAccount] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<IProfile | undefined>();
    const [profiles, setProfiles] = useState<IProfile[]>([]);
    const { t } = useTranslation();
    const theme = useTheme();
    const onLoginModalClose = () => {
        setOpenLogin(false);
    };
    const servConfig = (name: HTMLInputElement, pass: HTMLInputElement, aport: HTMLInputElement): void => {
        setOpenCreateAccount(false);
        fetch(PDP + "/configServ/" + name.value + "/" + pass.value + "/" + aport.value, { method: 'POST' }).then((response) => response.text()).then((data) => {
            if (data.includes("404")) {
                ToasterHandler(t("errors.account_creation"), "error");
            }
            discover();
        }).catch(() => {
            ToasterHandler(t("errors.account_creation"), "error");
        });
    };

    useLayoutEffect(() => {
        document.getElementsByTagName("html")[0].style.overflowY = "hidden";
        return () => {
            document.getElementsByTagName("html")[0].style.overflowY = "auto";
        };
    }, []);

    useEffect(() => {
        discover();
    }, []);
    const discover = (): void => {
        fetch(PDP + "/profile/discover", { cache: 'no-store' }).then(function (response) {
            return response.text();
        }).then(async function (fetchedData: string) {
            const data = JSON.parse(fetchedData);
            if (data.length === 0) {
                setOpenCreateAccount(true);
                return;
            }
            setProfiles(data);
        },
        ).catch(function () {
            ToasterHandler(t("errors.profile_fetching"), "error");
        });
    };
    return (
        <div style={{ width: "100vw", height: "100vh", background: theme.palette.background.default }}>
            <StarBackground />
            <div style={{ paddingTop: "100px", textAlign: 'center', width: "100%" }}>
                <h1 id="whosreading">{t("whosreading")}</h1>
            </div>
            <div id="login_discover">
                {profiles.map((profile, index) => {
                    return (
                        <LoginCard profile={profile} key={index} setOpenLogin={setOpenLogin} setSelectedProfile={setSelectedProfile} />
                    );
                })}
            </div>
            <LoginDialog openModal={openLogin} onClose={onLoginModalClose} title={t("login")}
                text={t("InsertPassword")} okBtn={t("loginInBtn")} cancelBtn={t("cancel")}
                profile={selectedProfile} />
            <CreateAccountDialog openModal={openCreateAccount} title={t("firstConfig")}
                text={t("createFirstAccount")}
                createFunction={servConfig} />
        </div>
    );
}
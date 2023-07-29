import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const previousLanguage = localStorage.getItem("language") || "dev";
i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: previousLanguage,
    debug: true,
    detection: {
        order: ["queryString", "cookie"],
    },
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
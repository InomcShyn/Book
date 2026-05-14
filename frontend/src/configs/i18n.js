import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTrans from '@/assets/locales/en.json';
import viTrans from '@/assets/locales/vi.json';
import { getLocalstorageData } from "@/utils/helper/localstorage";
const KEY_UP_LOCAL_STORAGE = "i18nextLng"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: getLocalstorageData(KEY_UP_LOCAL_STORAGE),
    resources: {
      en: {
        translation: enTrans,
      },
      vi: {
        translation: viTrans,
      },
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: KEY_UP_LOCAL_STORAGE,
    }
  });

export default i18n;

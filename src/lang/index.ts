import Vue from 'vue';
import VueI18n from 'vue-i18n';
// element-ui built-in lang
import elementEnLocale from 'element-ui/lib/locale/lang/en';
import elementEsLocale from 'element-ui/lib/locale/lang/es';
import elementJaLocale from 'element-ui/lib/locale/lang/ja';
import elementKoLocale from 'element-ui/lib/locale/lang/ko';
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';
// User defined lang
import enLocale from './en';
import esLocale from './es';
import { getLanguage } from '@/utils/cookies';
import jaLocale from './ja';
import koLocale from './ko';
import zhLocale from './zh';

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
  },
  es: {
    ...esLocale,
    ...elementEsLocale,
  },
  ja: {
    ...jaLocale,
    ...elementJaLocale,
  },
  ko: {
    ...koLocale,
    ...elementKoLocale,
  },
};

export const getLocale = () => {
  const cookieLanguage = getLanguage();
  if (cookieLanguage) {
    return cookieLanguage;
  }

  const language = navigator.language.toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }

  // Default language is english
  return 'en';
};

const i18n = new VueI18n({
  locale: getLocale(),
  messages,
});

export default i18n;

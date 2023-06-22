import {I18n} from "i18n-js";
import * as RNLocalize from "react-native-localize";

import en from "./locales/en";
import es from "./locales/es";
import pt from "./locales/pt";

const locales = RNLocalize.getLocales();
console.log(locales)

if (Array.isArray(locales)) {
  //I18n.locale = locales[0].languageTag;
}

const i18n = new I18n({
  ...en,
  ...pt,
    'pt-BR': {
      save6m:"12",
      save12m:"36",
      $1m:"R$ 29.90",
      $6m:"R$ 26.70",
      $6t:"R$ 159.90",
      $12m:"R$ 19.20",
      $12t:"R$ 229.90",
    },
  ...es,
    'es-CO': {
      save6m:"12",
      save12m:"36",
      $1m:"$29.900",
      $6m:"$26.650",
      $6t:"$159.900",
      $12m:"$19.200",
      $12t:"$229.900",
    },
    'es-CL': {
      save6m:"8",
      save12m:"36",
      $1m:"$5.200",
      $6m:"$4.750",
      $6t:"$28.500",
      $12m:"$3.325",
      $12t:"$39.900",
    },
    'es-MX': {
      save6m:"10",
      save12m:"40",
      $1m:"$149.00",
      $6m:"$133.00",
      $6t:"$799.00",
      $12m:"$90.75",
      $12t:"$1,089.00",
    },
    'es-ES': {
      save6m:"12",
      save12m:"36",
      $1m:"€8.49",
      $6m:"€7.49",
      $6t:"€44.99",
      $12m:"€5.40",
      $12t:"€64.99",
    },
});

console.log('.......', i18n)
i18n.defaultLocale = "es";
i18n.locale = locales[0].languageTag;
//i18n.locale = "es";
i18n.enableFallback = true;

console.log('names', i18n.t("name"))
/* I18n.translations = {
  en,
  pt,
    'pt-BR': {
      save6m:"12",
      save12m:"36",
      $1m:"R$ 29.90",
      $6m:"R$ 26.70",
      $6t:"R$ 159.90",
      $12m:"R$ 19.20",
      $12t:"R$ 229.90",
    },
  es,
    'es-CO': {
      save6m:"12",
      save12m:"36",
      $1m:"$29.900",
      $6m:"$26.650",
      $6t:"$159.900",
      $12m:"$19.200",
      $12t:"$229.900",
    },
    'es-CL': {
      save6m:"8",
      save12m:"36",
      $1m:"$5.200",
      $6m:"$4.750",
      $6t:"$28.500",
      $12m:"$3.325",
      $12t:"$39.900",
    },
    'es-MX': {
      save6m:"10",
      save12m:"40",
      $1m:"$149.00",
      $6m:"$133.00",
      $6t:"$799.00",
      $12m:"$90.75",
      $12t:"$1,089.00",
    },
    'es-ES': {
      save6m:"12",
      save12m:"36",
      $1m:"€8.49",
      $6m:"€7.49",
      $6t:"€44.99",
      $12m:"€5.40",
      $12t:"€64.99",
    },
}; */

export default i18n;
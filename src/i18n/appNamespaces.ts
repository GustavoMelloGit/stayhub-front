import i18n from './index';
import dashboardEn from './locales/en/dashboard.json';
import dashboardPt from './locales/pt/dashboard.json';
import stayEn from './locales/en/stay.json';
import stayPt from './locales/pt/stay.json';
import propertyEn from './locales/en/property.json';
import propertyPt from './locales/pt/property.json';
import billingEn from './locales/en/billing.json';
import billingPt from './locales/pt/billing.json';

/**
 * Traduções das telas do produto.
 *
 * Importado por `components/layout`, que é carregado sob demanda: os JSON
 * viajam no chunk do app em vez do chunk de entrada, que a landing pública
 * também baixa. Registrar acontece na avaliação do módulo, antes de qualquer
 * componente do app renderizar, então nenhuma tela chega a exibir a chave crua.
 */
const BUNDLES = {
  en: {
    dashboard: dashboardEn,
    stay: stayEn,
    property: propertyEn,
    billing: billingEn,
  },
  pt: {
    dashboard: dashboardPt,
    stay: stayPt,
    property: propertyPt,
    billing: billingPt,
  },
} as const;

Object.entries(BUNDLES).forEach(([language, namespaces]) => {
  Object.entries(namespaces).forEach(([namespace, resources]) => {
    i18n.addResourceBundle(language, namespace, resources, true, true);
  });
});

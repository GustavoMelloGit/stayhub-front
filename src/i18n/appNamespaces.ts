import i18n from './index';
import './stayNamespace';
import dashboardEn from './locales/en/dashboard.json';
import dashboardPt from './locales/pt/dashboard.json';
import propertyEn from './locales/en/property.json';
import propertyPt from './locales/pt/property.json';
import billingEn from './locales/en/billing.json';
import billingPt from './locales/pt/billing.json';

/**
 * Traduções das telas do produto. O namespace `stay` vem de
 * `stayNamespace.ts`, que a tela pública de instruções também importa.
 *
 * Importado por `components/layout`, que é carregado sob demanda: os JSON
 * viajam no chunk do app em vez do chunk de entrada, que a landing pública
 * também baixa. Registrar acontece na avaliação do módulo, antes de qualquer
 * componente do app renderizar, então nenhuma tela chega a exibir a chave crua.
 */
const BUNDLES = {
  en: {
    dashboard: dashboardEn,
    property: propertyEn,
    billing: billingEn,
  },
  pt: {
    dashboard: dashboardPt,
    property: propertyPt,
    billing: billingPt,
  },
} as const;

Object.entries(BUNDLES).forEach(([language, namespaces]) => {
  Object.entries(namespaces).forEach(([namespace, resources]) => {
    i18n.addResourceBundle(language, namespace, resources, true, true);
  });
});

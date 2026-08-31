import i18n from './index';
import stayEn from './locales/en/stay.json';
import stayPt from './locales/pt/stay.json';

/**
 * Namespace `stay` isolado dos demais do produto: a tela pública de instruções
 * (`/stay/:id`) fica fora do `AppLayout` e, por isso, não passa por
 * `appNamespaces.ts`. Ela importa este módulo direto, e `appNamespaces` também
 * — assim o hóspede baixa só a tradução da própria tela, e o app continua
 * registrando tudo de uma vez.
 */
i18n.addResourceBundle('en', 'stay', stayEn, true, true);
i18n.addResourceBundle('pt', 'stay', stayPt, true, true);

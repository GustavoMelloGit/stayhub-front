const STORAGE_KEY = 'sogio_landing_lang_choice';

/**
 * Marca que a pessoa escolheu o idioma no seletor da landing.
 *
 * Existe para separar escolha de detecção. O `i18next` grava o idioma
 * detectado no mesmo lugar em que gravaria o escolhido, então o cache dele não
 * serve para distinguir os dois casos, e sem essa distinção quem clica em
 * "Português" é mandado de volta para `/en` pelo redirecionamento automático.
 */
export const rememberLanguageChoice = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Sem persistência disponível: a escolha vale só para esta navegação.
  }
};

export const hasChosenLanguage = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

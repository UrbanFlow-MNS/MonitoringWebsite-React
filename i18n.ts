import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector) // detect user language
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      fr: {
        translation: {
          welcome: 'Bienvenue sur notre application',
          login: 'Connexion',
          register: 'Inscription'
        },
        auth: {
          access_denied: {
            title: 'Accès refusé',
            description: 'Cette application est réservée aux super-administrateurs.',
            logout_action: 'Se déconnecter'
          }
        }
      },
      en: {
        translation: {
          welcome: 'Welcome to our application',
          login: 'Login',
          register: 'Register'
        },
        auth: {
          access_denied: {
            title: 'Access denied',
            description: 'This application is restricted to super administrators.',
            logout_action: 'Log out'
          }
        }
      }
    },
    ns: ['translation', 'auth'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
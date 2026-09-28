import type { LegalDocumentContent } from '../types';

/**
 * Cookie Policy — English translation of cookies.es.ts.
 * NOT legally reviewed: the Spanish text is the reference version.
 */
export const cookiesEn: LegalDocumentContent = {
  title: 'Cookie Policy',
  summary: 'Which cookies and local storage the {{brandName}} web app uses, why, and how to change your preferences.',
  sections: [
    {
      id: 'que-son',
      title: '1. What cookies are',
      blocks: [
        {
          type: 'p',
          text: 'Cookies are small files a website stores in your browser. Similar technologies, such as local storage (localStorage) or IndexedDB, let a site store information in your browser in a similar way. In this policy we call all of them "cookies".',
        },
      ],
    },
    {
      id: 'categorias',
      title: '2. Which types we use',
      blocks: [
        {
          type: 'list',
          items: [
            'Necessary: essential to sign in, keep your session secure, protect forms and remember your cart and your cookie choice. They cannot be turned off because the site does not work without them.',
            'Preferences (optional): remember choices you make in the interface, such as light or dark mode, tutorials you have already seen and the language of the legal documents. If you reject them, the site still works but will forget those choices when you reload or close the page.',
          ],
        },
        {
          type: 'note',
          text: '{{brandName}} does not use analytics cookies or advertising/marketing cookies. If they are added in the future, this policy will be updated and your consent will be requested before enabling them.',
        },
      ],
    },
    {
      id: 'inventario',
      title: '3. Cookie details',
      blocks: [
        {
          type: 'table',
          headers: ['Name', 'Type', 'Category', 'Purpose', 'Duration'],
          rows: [
            ['sanken-session', 'Cookie (SanKen server)', 'Necessary', 'Keep you securely signed in.', 'Until you sign out or it expires due to inactivity (120 minutes by default).'],
            ['XSRF-TOKEN', 'Cookie (SanKen server)', 'Necessary', 'Protect forms against cross-site request forgery (CSRF).', 'Same as the session.'],
            ['sanken-auth', 'Local storage', 'Necessary', 'Keep your access token and basic account data so you are not asked to sign in on every visit.', 'Until you sign out.'],
            ['sanken-cart', 'Local storage', 'Necessary', 'Remember the products in your store cart.', 'Until you empty the cart or place the order.'],
            ['sanken-cookie-consent', 'Local storage', 'Necessary', 'Remember your cookie choice and the version of this policy you accepted.', '12 months, or until this policy changes.'],
            ['firebaseLocalStorageDb', 'IndexedDB (Google Firebase)', 'Necessary', 'Complete sign-in with Google. Only created if you choose "Continue with Google".', 'Temporary: deleted when sign-in finishes.'],
            ['Service worker and push subscription', 'Browser storage', 'Necessary', 'Receive browser notifications. Only if you enable them in Settings.', 'Until you disable them.'],
            ['sanken-theme', 'Local storage', 'Preferences', 'Remember whether you prefer light, dark or system mode.', 'Until you clear it or withdraw consent.'],
            ['sanken_tutorial_seen_*', 'Local storage', 'Preferences', 'Remember which tutorials you have seen so they are not repeated.', 'Until you clear it or withdraw consent.'],
            ['sanken-legal-locale', 'Local storage', 'Preferences', 'Remember the language you read the legal documents in.', 'Until you clear it or withdraw consent.'],
          ],
        },
      ],
    },
    {
      id: 'terceros',
      title: '4. Third-party services',
      blocks: [
        {
          type: 'list',
          items: [
            'Google Fonts: the site downloads its typeface from Google servers. This does not place Google cookies in your browser from SanKen, but Google receives your IP address and technical browser data.',
            'Sign in with Google: if you use it, a Google window opens in which Google may use its own cookies under its privacy policy.',
          ],
        },
      ],
    },
    {
      id: 'gestionar',
      title: '5. How to manage your preferences',
      blocks: [
        {
          type: 'list',
          items: [
            'The first time you visit the site we show a notice to accept or reject optional cookies, or configure them.',
            'You can change your choice at any time with the "Cookie settings" button on this page, in the footer or in Settings.',
            'If you withdraw consent for preferences, we delete the preference keys stored in your browser.',
            'You can also delete or block cookies in your browser settings. If you block the necessary ones, you will not be able to sign in.',
          ],
        },
      ],
    },
    {
      id: 'movil',
      title: '6. Mobile app',
      blocks: [
        {
          type: 'p',
          text: 'The mobile app does not use browser cookies or advertising/analytics tracking technologies. It keeps in your phone\'s secure storage only what it needs to work (your session, your cart, the workout in progress) and your preferences (visual theme, tutorials seen and whether you enabled notifications). The session is deleted when you sign out, and everything else when you uninstall the app.',
        },
      ],
    },
    {
      id: 'cambios',
      title: '7. Changes to this policy',
      blocks: [
        {
          type: 'p',
          text: 'If we change the cookies we use, we will update this policy and its version, and show you the cookie notice again. For any questions write to {{privacyEmail}}.',
        },
      ],
    },
  ],
};

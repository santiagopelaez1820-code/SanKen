// Esta línea sirve para importar el tipo del contenido de un documento legal.
import type { LegalDocumentContent } from '../types';

/**
 * Cookie Policy — English translation of cookies.es.ts.
 * Reviewed by the SanKen owner; the Spanish text is the reference version.
 */
// Esta línea sirve para declarar el contenido del documento legal "cookiesEn".
export const cookiesEn: LegalDocumentContent = {
  // Esta línea sirve para definir el título del documento: «Cookie Policy».
  title: 'Cookie Policy',
  // Esta línea sirve para definir el resumen del documento: «Which cookies and local storage the {{brandName}} web app us…».
  summary: 'Which cookies and local storage the {{brandName}} web app uses, why, and how to change your preferences.',
  // Esta línea sirve para abrir la lista de secciones del documento.
  sections: [
    {
      // Esta línea sirve para identificar la sección con el id "que-son".
      id: 'que-son',
      // Esta línea sirve para definir el título de la sección: «1. What cookies are».
      title: '1. What cookies are',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Cookies are small files a website stores in your browser. Similar tech…».
          text: 'Cookies are small files a website stores in your browser. Similar technologies, such as local storage (localStorage) or IndexedDB, let a site store information in your browser in a similar way. In this policy we call all of them "cookies".',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "categorias".
      id: 'categorias',
      // Esta línea sirve para definir el título de la sección: «2. Which types we use».
      title: '2. Which types we use',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Necessary: essential to sign in, keep your session secure, p…».
            'Necessary: essential to sign in, keep your session secure, protect forms and remember your cart and your cookie choice. They cannot be turned off because the site does not work without them.',
            // Esta línea sirve para agregar el ítem: «Preferences (optional): remember choices you make in the int…».
            'Preferences (optional): remember choices you make in the interface, such as light or dark mode, tutorials you have already seen and the language of the legal documents. If you reject them, the site still works but will forget those choices when you reload or close the page.',
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es una nota destacada.
          type: 'note',
          // Esta línea sirve para incluir el texto: «{{brandName}} does not use analytics cookies or advertising/marketing …».
          text: '{{brandName}} does not use analytics cookies or advertising/marketing cookies. If they are added in the future, this policy will be updated and your consent will be requested before enabling them.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "inventario".
      id: 'inventario',
      // Esta línea sirve para definir el título de la sección: «3. Cookie details».
      title: '3. Cookie details',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una tabla.
          type: 'table',
          // Esta línea sirve para definir los encabezados de la tabla.
          headers: ['Name', 'Type', 'Category', 'Purpose', 'Duration'],
          // Esta línea sirve para abrir las filas de la tabla.
          rows: [
            // Esta línea sirve para agregar la fila de «sanken-session».
            ['sanken-session', 'Cookie (SanKen server)', 'Necessary', 'Keep you securely signed in.', 'Until you sign out or it expires due to inactivity (120 minutes by default).'],
            // Esta línea sirve para agregar la fila de «XSRF-TOKEN».
            ['XSRF-TOKEN', 'Cookie (SanKen server)', 'Necessary', 'Protect forms against cross-site request forgery (CSRF).', 'Same as the session.'],
            // Esta línea sirve para agregar la fila de «sanken-auth».
            ['sanken-auth', 'Local storage', 'Necessary', 'Keep your access token and basic account data so you are not asked to sign in on every visit.', 'Until you sign out.'],
            // Esta línea sirve para agregar la fila de «sanken-cart».
            ['sanken-cart', 'Local storage', 'Necessary', 'Remember the products in your store cart.', 'Until you empty the cart or place the order.'],
            // Esta línea sirve para agregar la fila de «sanken-cookie-consent».
            ['sanken-cookie-consent', 'Local storage', 'Necessary', 'Remember your cookie choice and the version of this policy you accepted.', '12 months, or until this policy changes.'],
            // Esta línea sirve para agregar la fila de «firebaseLocalStorageDb».
            ['firebaseLocalStorageDb', 'IndexedDB (Google Firebase)', 'Necessary', 'Complete sign-in with Google. Only created if you choose "Continue with Google".', 'Temporary: deleted when sign-in finishes.'],
            // Esta línea sirve para agregar la fila de «Service worker and push subscription».
            ['Service worker and push subscription', 'Browser storage', 'Necessary', 'Receive browser notifications. Only if you enable them in Settings.', 'Until you disable them.'],
            // Esta línea sirve para agregar la fila de «sanken-theme».
            ['sanken-theme', 'Local storage', 'Preferences', 'Remember whether you prefer light, dark or system mode.', 'Until you clear it or withdraw consent.'],
            // Esta línea sirve para agregar la fila de «sanken_tutorial_seen_*».
            ['sanken_tutorial_seen_*', 'Local storage', 'Preferences', 'Remember which tutorials you have seen so they are not repeated.', 'Until you clear it or withdraw consent.'],
            // Esta línea sirve para agregar la fila de «sanken-legal-locale».
            ['sanken-legal-locale', 'Local storage', 'Preferences', 'Remember the language you read the legal documents in.', 'Until you clear it or withdraw consent.'],
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "terceros".
      id: 'terceros',
      // Esta línea sirve para definir el título de la sección: «4. Third-party services».
      title: '4. Third-party services',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Google Fonts: the site downloads its typeface from Google se…».
            'Google Fonts: the site downloads its typeface from Google servers. This does not place Google cookies in your browser from SanKen, but Google receives your IP address and technical browser data.',
            // Esta línea sirve para agregar el ítem: «Sign in with Google: if you use it, a Google window opens in…».
            'Sign in with Google: if you use it, a Google window opens in which Google may use its own cookies under its privacy policy.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "gestionar".
      id: 'gestionar',
      // Esta línea sirve para definir el título de la sección: «5. How to manage your preferences».
      title: '5. How to manage your preferences',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «The first time you visit the site we show a notice to accept…».
            'The first time you visit the site we show a notice to accept or reject optional cookies, or configure them.',
            // Esta línea sirve para agregar el ítem: «You can change your choice at any time with the "Cookie sett…».
            'You can change your choice at any time with the "Cookie settings" button on this page, in the footer or in Settings.',
            // Esta línea sirve para agregar el ítem: «If you withdraw consent for preferences, we delete the prefe…».
            'If you withdraw consent for preferences, we delete the preference keys stored in your browser.',
            // Esta línea sirve para agregar el ítem: «You can also delete or block cookies in your browser setting…».
            'You can also delete or block cookies in your browser settings. If you block the necessary ones, you will not be able to sign in.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "movil".
      id: 'movil',
      // Esta línea sirve para definir el título de la sección: «6. Mobile app».
      title: '6. Mobile app',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «The mobile app does not use browser cookies or advertising/analytics t…».
          text: 'The mobile app does not use browser cookies or advertising/analytics tracking technologies. It keeps in your phone\'s secure storage only what it needs to work (your session, your cart, the workout in progress) and your preferences (visual theme, tutorials seen, whether you enabled notifications and whether you hid the brand card on Home). The session is deleted when you sign out, and everything else when you uninstall the app.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "cambios".
      id: 'cambios',
      // Esta línea sirve para definir el título de la sección: «7. Changes to this policy».
      title: '7. Changes to this policy',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «If we change the cookies we use, we will update this policy and its ve…».
          text: 'If we change the cookies we use, we will update this policy and its version, and show you the cookie notice again. For any questions write to {{privacyEmail}}.',
        },
      ],
    },
  ],
};

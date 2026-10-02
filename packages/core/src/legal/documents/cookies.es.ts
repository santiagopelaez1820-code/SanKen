import type { LegalDocumentContent } from '../types';

/**
 * Política de Cookies — texto de referencia (español).
 *
 * El inventario de la sección 3 refleja lo que la web REALMENTE guarda
 * (auditado en apps/web/src/lib/*-store.ts, tutorial-storage.ts, api.ts,
 * firebase.ts y config/session.php del backend). Si se agrega una cookie o
 * clave de almacenamiento nueva, debe agregarse acá y en COOKIE_INVENTORY
 * (../cookies.ts), y subirse la versión del documento.
 *
 * Revisado y aprobado por el responsable de SanKen (v1.0).
 */
export const cookiesEs: LegalDocumentContent = {
  title: 'Política de Cookies',
  summary: 'Qué cookies y almacenamiento local usa la versión web de {{brandName}}, para qué, y cómo cambiar tus preferencias.',
  sections: [
    {
      id: 'que-son',
      title: '1. Qué son las cookies',
      blocks: [
        {
          type: 'p',
          text: 'Las cookies son pequeños archivos que un sitio web guarda en tu navegador. Otras tecnologías parecidas, como el almacenamiento local (localStorage) o IndexedDB, permiten guardar información en tu navegador de forma similar. En esta política llamamos "cookies" a todas ellas.',
        },
      ],
    },
    {
      id: 'categorias',
      title: '2. Qué tipos usamos',
      blocks: [
        {
          type: 'list',
          items: [
            'Necesarias: imprescindibles para iniciar sesión, mantener tu sesión segura, proteger los formularios y recordar tu carrito y tu elección sobre cookies. No se pueden desactivar porque sin ellas la web no funciona.',
            'Preferencias (opcionales): recuerdan elecciones que haces en la interfaz, como el modo claro u oscuro, los tutoriales que ya viste y el idioma de los documentos legales. Si las rechazas, la web funciona igual pero olvidará esas elecciones al recargar o cerrar la página.',
          ],
        },
        {
          type: 'note',
          text: '{{brandName}} no usa cookies analíticas ni cookies de publicidad o marketing. Si en el futuro se incorporan, se actualizará esta política y se te pedirá el consentimiento antes de activarlas.',
        },
      ],
    },
    {
      id: 'inventario',
      title: '3. Detalle de las cookies',
      blocks: [
        {
          type: 'table',
          headers: ['Nombre', 'Tipo', 'Categoría', 'Finalidad', 'Duración'],
          rows: [
            ['sanken-session', 'Cookie (servidor de SanKen)', 'Necesaria', 'Mantener tu sesión iniciada de forma segura.', 'Hasta que cierras sesión o expira por inactividad (por defecto, 120 minutos).'],
            ['XSRF-TOKEN', 'Cookie (servidor de SanKen)', 'Necesaria', 'Proteger los formularios contra ataques de falsificación de solicitudes (CSRF).', 'La misma que la sesión.'],
            ['sanken-auth', 'Almacenamiento local', 'Necesaria', 'Guardar tu token de acceso y los datos básicos de tu cuenta para no pedirte el inicio de sesión en cada visita.', 'Hasta que cierras sesión.'],
            ['sanken-cart', 'Almacenamiento local', 'Necesaria', 'Recordar los productos de tu carrito de la tienda.', 'Hasta que vacías el carrito o haces el pedido.'],
            ['sanken-cookie-consent', 'Almacenamiento local', 'Necesaria', 'Recordar tu elección sobre cookies y la versión de esta política que aceptaste.', '12 meses, o hasta que cambie esta política.'],
            ['firebaseLocalStorageDb', 'IndexedDB (Google Firebase)', 'Necesaria', 'Completar el inicio de sesión con Google. Solo se crea si eliges "Continuar con Google".', 'Temporal: se borra al terminar el inicio de sesión.'],
            ['Service worker y suscripción push', 'Almacenamiento del navegador', 'Necesaria', 'Recibir notificaciones del navegador. Solo si las activas en Configuración.', 'Hasta que las desactivas.'],
            ['sanken-theme', 'Almacenamiento local', 'Preferencias', 'Recordar si prefieres modo claro, oscuro o el del sistema.', 'Hasta que la borras o retiras el consentimiento.'],
            ['sanken_tutorial_seen_*', 'Almacenamiento local', 'Preferencias', 'Recordar qué tutoriales ya viste para no repetirlos.', 'Hasta que la borras o retiras el consentimiento.'],
            ['sanken-legal-locale', 'Almacenamiento local', 'Preferencias', 'Recordar el idioma en que lees los documentos legales.', 'Hasta que la borras o retiras el consentimiento.'],
          ],
        },
      ],
    },
    {
      id: 'terceros',
      title: '4. Servicios de terceros',
      blocks: [
        {
          type: 'list',
          items: [
            'Google Fonts: la web descarga su tipografía desde los servidores de Google. Esto no instala cookies de Google en tu navegador desde SanKen, pero Google recibe tu dirección IP y datos técnicos del navegador.',
            'Inicio de sesión con Google: si lo usas, se abre una ventana de Google en la que Google puede usar sus propias cookies según su política de privacidad.',
          ],
        },
      ],
    },
    {
      id: 'gestionar',
      title: '5. Cómo gestionar tus preferencias',
      blocks: [
        {
          type: 'list',
          items: [
            'La primera vez que visitas la web te mostramos un aviso para aceptar o rechazar las cookies opcionales, o configurarlas.',
            'Puedes cambiar tu elección cuando quieras con el botón "Configurar cookies" de esta página, del pie de página o de Configuración.',
            'Si retiras el consentimiento de preferencias, borramos las claves de preferencias guardadas en tu navegador.',
            'También puedes borrar o bloquear cookies desde la configuración de tu navegador. Si bloqueas las necesarias, no podrás iniciar sesión.',
          ],
        },
      ],
    },
    {
      id: 'movil',
      title: '6. Aplicación móvil',
      blocks: [
        {
          type: 'p',
          text: 'La app móvil no usa cookies de navegador ni tecnologías de seguimiento publicitario o analítico. Guarda en el almacenamiento seguro de tu teléfono solo lo necesario para funcionar (tu sesión, tu carrito, el entrenamiento en curso) y tus preferencias (tema visual, tutoriales vistos, si activaste las notificaciones y si ocultaste la tarjeta de marca de Inicio). La sesión se borra al cerrar sesión, y todo lo demás al desinstalar la app.',
        },
      ],
    },
    {
      id: 'cambios',
      title: '7. Cambios en esta política',
      blocks: [
        {
          type: 'p',
          text: 'Si cambiamos las cookies que usamos, actualizaremos esta política y su versión, y te volveremos a mostrar el aviso de cookies. Para cualquier duda escribe a {{privacyEmail}}.',
        },
      ],
    },
  ],
};

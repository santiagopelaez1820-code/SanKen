import type { LegalDocumentContent } from '../types';

/**
 * Política de Privacidad — texto de referencia (español).
 *
 * Redactada a partir del comportamiento REAL del código (auditoría de
 * apps/api, apps/web y apps/mobile). Si una funcionalidad cambia qué datos
 * se recogen o a quién se envían, este texto debe actualizarse y su versión
 * subirse en ../versions.ts y apps/api/config/legal.php.
 *
 * BORRADOR: requiere revisión del responsable y de un profesional jurídico.
 */
export const privacyEs: LegalDocumentContent = {
  title: 'Política de Privacidad',
  summary:
    'Qué datos personales trata {{brandName}}, para qué los usa, con quién los comparte y cómo puedes ejercer tus derechos.',
  sections: [
    {
      id: 'responsable',
      title: '1. Responsable del tratamiento',
      blocks: [
        {
          type: 'p',
          text: 'El responsable del tratamiento de tus datos personales en {{brandName}} es {{legalName}}, identificado con {{taxId}}, con domicilio en {{address}} ({{country}}).',
        },
        {
          type: 'p',
          text: 'Para cualquier consulta o solicitud sobre privacidad puedes escribir a {{privacyEmail}}.',
        },
      ],
    },
    {
      id: 'datos',
      title: '2. Qué datos tratamos',
      blocks: [
        {
          type: 'p',
          text: 'Solo tratamos los datos que la aplicación necesita para las funciones que usas. Según cómo utilices {{brandName}}, pueden ser:',
        },
        {
          type: 'table',
          headers: ['Categoría', 'Datos', 'Origen'],
          rows: [
            [
              'Cuenta',
              'Nombre, correo electrónico, contraseña (guardada solo como hash, nunca en texto plano), teléfono si lo proporcionas, foto de perfil si la subes, rol (usuario o entrenador) y fecha de verificación del correo.',
              'Tú, al registrarte o editar tu perfil.',
            ],
            [
              'Inicio de sesión con Google',
              'Nombre, correo, indicación de si el correo está verificado, foto de perfil de Google e identificador técnico de Firebase.',
              'Google / Firebase, solo si eliges "Continuar con Google".',
            ],
            [
              'Seguridad de la cuenta',
              'Configuración de verificación en dos pasos (secreto cifrado y códigos de recuperación), sesiones activas con el nombre del navegador o dispositivo desde el que se iniciaron, fecha de última actividad y registro de inicios de sesión (fecha y si fue desde web o móvil).',
              'Generados por la aplicación al usarla.',
            ],
            [
              'Perfil de entrenamiento',
              'Edad, sexo, estatura, peso, nivel de experiencia, objetivos, días por semana disponibles para entrenar, equipamiento disponible, país, departamento/estado, ciudad y gimnasio.',
              'Tú, en el cuestionario inicial y en la configuración.',
            ],
            [
              'Entrenamientos y progreso',
              'Rutinas asignadas o generadas, sesiones realizadas, omitidas o canceladas, ejercicios, series (peso, repeticiones, esfuerzo percibido), duración, notas y valoraciones, récords personales, logros, experiencia (XP), rachas, retos, calendario y recordatorios.',
              'Tú, al registrar tu actividad, y la aplicación al calcular tu progreso.',
            ],
            [
              'Estado previo al entrenamiento',
              'Calidad de sueño, nivel de energía y dolor muscular que indiques antes de entrenar, y el ajuste de la sesión que se derive de ello.',
              'Tú, en el pre-check del entrenamiento (opcional).',
            ],
            [
              'Medidas corporales',
              'Peso, porcentaje de grasa corporal y perímetros (pecho, cintura, cadera, brazo, muslo) con su fecha.',
              'Tú, si decides registrarlas.',
            ],
            [
              'Nutrición',
              'Comidas registradas (alimento, cantidad, tipo de comida y fecha), plan nutricional, objetivos calculados de calorías y macronutrientes, búsquedas de alimentos y códigos de barras escaneados.',
              'Tú, en la sección de nutrición.',
            ],
            [
              'Récords con video',
              'Ejercicio, peso, repeticiones y video que envíes para validar un récord, y el resultado de la revisión.',
              'Tú, si envías un récord para validación.',
            ],
            [
              'Comunicaciones',
              'Mensajes de chat con tu entrenador o tus clientes (contenido y estado de lectura), reportes de contenido que envíes y notificaciones de la aplicación.',
              'Tú y las personas con las que conversas.',
            ],
            [
              'Pedidos de la tienda',
              'Nombre, correo, teléfono, número de WhatsApp, departamento, ciudad, dirección, información adicional, productos, importes, estado del pedido, transportadora y número de guía.',
              'Tú, al hacer un pedido; el equipo de {{brandName}}, al gestionarlo.',
            ],
            [
              'Notificaciones push',
              'Identificador del dispositivo para notificaciones (app móvil) o datos de suscripción del navegador (web), solo si activas las notificaciones.',
              'Tu dispositivo o navegador, con tu permiso.',
            ],
          ],
        },
        {
          type: 'note',
          text: '{{brandName}} no procesa pagos en línea ni almacena datos de tarjetas. No usamos herramientas de analítica de terceros ni publicidad.',
        },
        {
          type: 'p',
          text: 'Dirección IP: el servidor la procesa de forma técnica para responder a tus solicitudes y para limitar intentos repetidos (por ejemplo, de inicio de sesión) como medida contra abusos. Puede figurar en los registros técnicos del servidor y de los túneles de conexión (ver sección 6). No la asociamos a tu perfil ni la usamos con fines publicitarios.',
        },
      ],
    },
    {
      id: 'finalidades',
      title: '3. Para qué usamos tus datos',
      blocks: [
        {
          type: 'list',
          items: [
            'Crear y administrar tu cuenta, y autenticarte (incluida la verificación del correo, la recuperación de contraseña y la verificación en dos pasos si la activas).',
            'Generar y ajustar tus rutinas según tu perfil, nivel, objetivos, disponibilidad, equipamiento y estado previo al entrenamiento.',
            'Registrar tus entrenamientos y mostrarte tu progreso, récords, estadísticas, logros, rachas y retos.',
            'Calcular objetivos nutricionales orientativos y registrar tu alimentación.',
            'Permitir la comunicación con tu entrenador (o con tus clientes, si eres entrenador).',
            'Mostrarte en rankings públicos únicamente si activas la opción "Rankings públicos" (puedes desactivarla cuando quieras), y en las clasificaciones de los retos en los que participes.',
            'Revisar los récords que envíes con video y las denuncias de contenido.',
            'Gestionar y entregar tus pedidos de la tienda y contactarte sobre ellos.',
            'Enviarte notificaciones push cuando las hayas activado, y correos transaccionales (verificación de correo, recuperación de contraseña).',
            'Mantener la seguridad del servicio, prevenir abusos y fraudes, y aplicar los Términos y Condiciones.',
            'Obtener estadísticas internas y agregadas de uso (por ejemplo, cuántas personas usan la app cada día y desde qué plataforma) para operar y mejorar el servicio. Estas estadísticas se calculan con nuestros propios registros, sin herramientas de terceros.',
          ],
        },
        {
          type: 'p',
          text: 'Base legal: el tratamiento se basa en tu autorización previa, expresa e informada (en particular para los datos de salud y condición física, que son datos sensibles), en la prestación del servicio que solicitas al aceptar los Términos y Condiciones y en la necesidad de mantener la seguridad del servicio, conforme a la Ley 1581 de 2012 de {{jurisdiction}} y sus normas reglamentarias.',
        },
      ],
    },
    {
      id: 'salud',
      title: '4. Datos de salud y condición física',
      blocks: [
        {
          type: 'p',
          text: 'Algunos datos que registras en {{brandName}} (peso, estatura, edad, sexo, composición y medidas corporales, calidad de sueño, energía, dolor muscular y alimentación) pueden considerarse datos relativos a la salud o datos sensibles según la ley aplicable. Por eso te pedimos una autorización específica y separada para tratarlos.',
        },
        {
          type: 'list',
          items: [
            'Los usamos exclusivamente para personalizar tus rutinas y objetivos nutricionales y para mostrarte tu progreso.',
            'No los vendemos ni los usamos para publicidad.',
            'Solo los ve tu entrenador si te vinculas con uno dentro de la app, y el equipo de administración de {{brandName}} cuando sea necesario para soporte, moderación o seguridad.',
            'Son opcionales en la medida en que puedes no registrar medidas, no completar el pre-check o no usar la sección de nutrición; sin algunos de ellos (por ejemplo, nivel, objetivos o peso) la aplicación no puede generar una rutina personalizada.',
          ],
        },
        {
          type: 'note',
          text: '{{brandName}} es una herramienta de entrenamiento y seguimiento. No presta servicios médicos, no realiza diagnósticos y no sustituye la valoración de un médico, nutricionista u otro profesional de la salud.',
        },
      ],
    },
    {
      id: 'destinatarios',
      title: '5. Con quién compartimos tus datos',
      blocks: [
        {
          type: 'p',
          text: 'No vendemos tus datos. Solo se comparten en estos casos:',
        },
        {
          type: 'list',
          items: [
            'Tu entrenador: si te vinculas con un entrenador en {{brandName}}, podrá ver la información necesaria para acompañarte (tu nombre, rutinas, entrenamientos y progreso) y conversar contigo por chat.',
            'Otros usuarios: tu nombre y tus marcas aparecen en rankings solo si activas "Rankings públicos"; en los retos en los que participas, tu nombre y avance aparecen en la clasificación del reto.',
            'Equipo de administración de {{brandName}}: acceso limitado a lo necesario para soporte, moderación, revisión de récords y gestión de pedidos.',
            'Proveedores técnicos que prestan servicios a {{brandName}} (ver sección 6), solo con los datos que cada uno necesita.',
            'Empresas de transporte: cuando corresponda, la transportadora que entregue tu pedido recibe el nombre, teléfono y dirección de entrega.',
            'Autoridades: cuando una ley o una orden de autoridad competente lo exija.',
          ],
        },
      ],
    },
    {
      id: 'terceros',
      title: '6. Servicios de terceros',
      blocks: [
        {
          type: 'table',
          headers: ['Servicio', 'Para qué', 'Qué información puede recibir'],
          rows: [
            [
              'Google (Firebase Authentication y Google Sign-In)',
              'Iniciar sesión o registrarte con tu cuenta de Google, solo si eliges esa opción.',
              'Los datos de tu cuenta de Google que autorizas compartir (nombre, correo, foto) y datos técnicos de la conexión. Google los trata según su propia política de privacidad.',
            ],
            [
              'Google Fonts (solo versión web)',
              'Cargar la tipografía de la interfaz.',
              'Tu dirección IP y datos técnicos del navegador al descargar la fuente.',
            ],
            [
              'Servicio de notificaciones de Expo (app móvil)',
              'Entregar notificaciones push en tu teléfono, a través de Firebase Cloud Messaging (Google) o Apple Push Notification service.',
              'El identificador de notificaciones de tu dispositivo y el contenido de la notificación (por ejemplo, el nombre de quien te escribe y el inicio del mensaje).',
            ],
            [
              'Servicio push de tu navegador (versión web)',
              'Entregar notificaciones en el navegador, si las activas.',
              'Una notificación cifrada; el proveedor depende de tu navegador (por ejemplo, Google, Mozilla o Apple).',
            ],
            [
              'Open Food Facts',
              'Buscar información nutricional de alimentos por nombre o código de barras.',
              'Solo el texto buscado o el código de barras. La consulta la hace el servidor de {{brandName}}, sin datos que te identifiquen.',
            ],
            [
              '{{emailProvider}}',
              'Enviar correos de verificación y de recuperación de contraseña.',
              'Tu correo electrónico y el contenido del mensaje.',
            ],
            [
              'ngrok y Cloudflare (túneles de conexión)',
              'Hoy el servidor de {{brandName}} (base de datos y archivos) funciona en equipos propios del responsable, sin proveedor de hosting externo, y se conecta a Internet a través de estos túneles.',
              'El tráfico entre la app y el servidor pasa por ellos, incluidos los datos que envías y recibes. Si se contrata un proveedor de hosting, se informará en una nueva versión de esta política.',
            ],
            [
              'WhatsApp (Meta)',
              'Solo si decides contactarnos por WhatsApp desde la app.',
              'La conversación ocurre en WhatsApp y se rige por sus políticas.',
            ],
          ],
        },
        {
          type: 'p',
          text: 'Algunos de estos proveedores pueden tratar datos fuera de tu país. Cuando eso ocurra, se aplicarán las garantías que exija la ley aplicable en {{jurisdiction}}.',
        },
      ],
    },
    {
      id: 'conservacion',
      title: '7. Cuánto tiempo conservamos tus datos',
      blocks: [
        {
          type: 'p',
          text: 'Conservamos tus datos mientras tu cuenta esté activa. Si se elimina tu cuenta, se eliminan también los datos asociados a ella (perfil, entrenamientos, medidas, nutrición, mensajes, notificaciones y consentimientos), salvo que una ley exija conservarlos por más tiempo. El registro interno de auditoría de acciones administrativas puede conservar referencias a la cuenta por motivos de seguridad. Plazos específicos: {{retentionPeriod}}.',
        },
        {
          type: 'p',
          text: 'Guardamos un registro de qué versión de cada documento legal aceptaste y cuándo, como prueba de tu consentimiento, mientras exista tu cuenta.',
        },
      ],
    },
    {
      id: 'derechos',
      title: '8. Tus derechos',
      blocks: [
        {
          type: 'p',
          text: 'De acuerdo con la ley colombiana de protección de datos personales (Ley 1581 de 2012 y sus normas reglamentarias), puedes:',
        },
        {
          type: 'list',
          items: [
            'Consultar qué datos tuyos tratamos y obtener una copia.',
            'Solicitar la corrección de datos inexactos o incompletos. Muchos puedes corregirlos tú mismo desde la configuración de la app.',
            'Eliminar tu cuenta y tus datos en cualquier momento desde Configuración > Eliminar mi cuenta, o solicitar la eliminación de datos concretos, cuando proceda.',
            'Retirar tu consentimiento, cuando el tratamiento se base en él. Retirarlo no afecta al tratamiento hecho antes, y puede impedir que sigamos prestando funciones que dependen de esos datos.',
            'Solicitar información sobre el uso que damos a tus datos y sobre esta política.',
            'Presentar una queja ante {{supervisoryAuthority}}, después de haber presentado tu consulta o reclamo ante nosotros.',
          ],
        },
        {
          type: 'p',
          text: 'Para ejercer cualquiera de estos derechos, escribe a {{privacyEmail}} desde el correo asociado a tu cuenta, indicando tu solicitud. Podremos pedirte información adicional para verificar tu identidad antes de atenderla.',
        },
        {
          type: 'p',
          text: 'Desde la configuración de la app también puedes, en cualquier momento: activar o desactivar tu aparición en rankings públicos, activar o desactivar las notificaciones push y, en la web, cambiar tus preferencias de cookies.',
        },
      ],
    },
    {
      id: 'seguridad',
      title: '9. Seguridad',
      blocks: [
        {
          type: 'list',
          items: [
            'Las contraseñas se guardan con un hash criptográfico, nunca en texto plano.',
            'Puedes activar la verificación en dos pasos; su secreto se guarda cifrado.',
            'El acceso a la información está limitado por roles (usuario, entrenador, administración).',
            'Los intentos repetidos de inicio de sesión y de registro se limitan automáticamente.',
          ],
        },
        {
          type: 'p',
          text: 'Ningún sistema es completamente infalible. Si detectamos un incidente de seguridad que afecte a tus datos, actuaremos según lo que exija la ley aplicable.',
        },
      ],
    },
    {
      id: 'menores',
      title: '10. Menores de edad',
      blocks: [
        {
          type: 'p',
          text: 'La aplicación solicita una edad mínima de 13 años. Para usar {{brandName}} sin autorización de un adulto debes tener al menos {{minimumAge}}. Si eres menor de esa edad, necesitas la autorización de tu madre, padre o representante legal.',
        },
      ],
    },
    {
      id: 'cookies',
      title: '11. Cookies y almacenamiento local',
      blocks: [
        {
          type: 'p',
          text: 'La versión web utiliza cookies y almacenamiento local del navegador. Los detalles están en la Política de Cookies. La app móvil guarda en el almacenamiento seguro del teléfono tu sesión y algunas preferencias; no usa cookies de seguimiento ni publicidad.',
        },
      ],
    },
    {
      id: 'cambios',
      title: '12. Cambios en esta política',
      blocks: [
        {
          type: 'p',
          text: 'Cada versión de esta política tiene un número y una fecha. Si hacemos cambios importantes, te pediremos que revises y aceptes la nueva versión antes de seguir usando la aplicación.',
        },
      ],
    },
  ],
};

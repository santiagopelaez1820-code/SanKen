// Esta línea sirve para importar el tipo del contenido de un documento legal.
import type { LegalDocumentContent } from '../types';

/**
 * Política de Privacidad — texto de referencia (español).
 *
 * Redactada a partir del comportamiento REAL del código (auditoría de
 * apps/api, apps/web y apps/mobile). Si una funcionalidad cambia qué datos
 * se recogen o a quién se envían, este texto debe actualizarse y su versión
 * subirse en ../versions.ts y apps/api/config/legal.php.
 *
 * Revisado y aprobado por el responsable de SanKen (v1.1). v1.2: rango de
 * edad 15–70 (sección Menores), aplicado a pedido del responsable.
 */
// Esta línea sirve para declarar el contenido del documento legal "privacyEs".
export const privacyEs: LegalDocumentContent = {
  // Esta línea sirve para definir el título del documento: «Política de Privacidad».
  title: 'Política de Privacidad',
  // Esta línea sirve para definir el resumen del documento (en la línea siguiente).
  summary:
    // Esta línea sirve para incluir el texto del resumen: «Qué datos personales trata {{brandName}}, para qué los usa, …».
    'Qué datos personales trata {{brandName}}, para qué los usa, con quién los comparte y cómo puedes ejercer tus derechos.',
  // Esta línea sirve para abrir la lista de secciones del documento.
  sections: [
    {
      // Esta línea sirve para identificar la sección con el id "responsable".
      id: 'responsable',
      // Esta línea sirve para definir el título de la sección: «1. Responsable del tratamiento».
      title: '1. Responsable del tratamiento',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «El responsable del tratamiento de tus datos personales en {{brandName}…».
          text: 'El responsable del tratamiento de tus datos personales en {{brandName}} es {{legalName}}, identificado con {{taxId}}, con domicilio en {{address}} ({{country}}).',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Para cualquier consulta o solicitud sobre privacidad puedes escribir a…».
          text: 'Para cualquier consulta o solicitud sobre privacidad puedes escribir a {{privacyEmail}}.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "datos".
      id: 'datos',
      // Esta línea sirve para definir el título de la sección: «2. Qué datos tratamos».
      title: '2. Qué datos tratamos',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Solo tratamos los datos que la aplicación necesita para las funciones …».
          text: 'Solo tratamos los datos que la aplicación necesita para las funciones que usas. Según cómo utilices {{brandName}}, pueden ser:',
        },
        {
          // Esta línea sirve para indicar que el bloque es una tabla.
          type: 'table',
          // Esta línea sirve para definir los encabezados de la tabla.
          headers: ['Categoría', 'Datos', 'Origen'],
          // Esta línea sirve para abrir las filas de la tabla.
          rows: [
            [
              // Esta línea sirve para agregar la celda de la fila: «Cuenta…».
              'Cuenta',
              // Esta línea sirve para agregar la celda de la fila: «Nombre, correo electrónico, contraseña (guardada s…».
              'Nombre, correo electrónico, contraseña (guardada solo como hash, nunca en texto plano), teléfono si lo proporcionas, foto de perfil si la subes, rol (usuario o entrenador) y fecha de verificación del correo.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, al registrarte o editar tu perfil.…».
              'Tú, al registrarte o editar tu perfil.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Inicio de sesión con Google…».
              'Inicio de sesión con Google',
              // Esta línea sirve para agregar la celda de la fila: «Nombre, correo, indicación de si el correo está ve…».
              'Nombre, correo, indicación de si el correo está verificado, foto de perfil de Google e identificador técnico de Firebase.',
              // Esta línea sirve para agregar la celda de la fila: «Google / Firebase, solo si eliges "Continuar con G…».
              'Google / Firebase, solo si eliges "Continuar con Google".',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Seguridad de la cuenta…».
              'Seguridad de la cuenta',
              // Esta línea sirve para agregar la celda de la fila: «Configuración de verificación en dos pasos (secret…».
              'Configuración de verificación en dos pasos (secreto cifrado y códigos de recuperación), sesiones activas con el nombre del navegador o dispositivo desde el que se iniciaron, fecha de última actividad y registro de inicios de sesión (fecha y si fue desde web o móvil).',
              // Esta línea sirve para agregar la celda de la fila: «Generados por la aplicación al usarla.…».
              'Generados por la aplicación al usarla.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Perfil de entrenamiento…».
              'Perfil de entrenamiento',
              // Esta línea sirve para agregar la celda de la fila: «Edad, sexo, estatura, peso, nivel de experiencia, …».
              'Edad, sexo, estatura, peso, nivel de experiencia, objetivos, días por semana disponibles para entrenar, equipamiento disponible, país, departamento/estado, ciudad y gimnasio.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, en el cuestionario inicial y en la configuraci…».
              'Tú, en el cuestionario inicial y en la configuración.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Entrenamientos y progreso…».
              'Entrenamientos y progreso',
              // Esta línea sirve para agregar la celda de la fila: «Rutinas asignadas o generadas, sesiones realizadas…».
              'Rutinas asignadas o generadas, sesiones realizadas, omitidas o canceladas, ejercicios, series (peso, repeticiones, esfuerzo percibido), duración, notas y valoraciones, récords personales, logros, experiencia (XP), rachas, retos, calendario y recordatorios.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, al registrar tu actividad, y la aplicación al …».
              'Tú, al registrar tu actividad, y la aplicación al calcular tu progreso.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Estado previo al entrenamiento…».
              'Estado previo al entrenamiento',
              // Esta línea sirve para agregar la celda de la fila: «Calidad de sueño, nivel de energía y dolor muscula…».
              'Calidad de sueño, nivel de energía y dolor muscular que indiques antes de entrenar, y el ajuste de la sesión que se derive de ello.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, en el pre-check del entrenamiento (opcional).…».
              'Tú, en el pre-check del entrenamiento (opcional).',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Medidas corporales…».
              'Medidas corporales',
              // Esta línea sirve para agregar la celda de la fila: «Peso, porcentaje de grasa corporal y perímetros (p…».
              'Peso, porcentaje de grasa corporal y perímetros (pecho, cintura, cadera, brazo, muslo) con su fecha.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, si decides registrarlas.…».
              'Tú, si decides registrarlas.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Nutrición…».
              'Nutrición',
              // Esta línea sirve para agregar la celda de la fila: «Comidas registradas (alimento, cantidad, tipo de c…».
              'Comidas registradas (alimento, cantidad, tipo de comida y fecha), plan nutricional, objetivos calculados de calorías y macronutrientes, búsquedas de alimentos y códigos de barras escaneados.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, en la sección de nutrición.…».
              'Tú, en la sección de nutrición.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Récords con video…».
              'Récords con video',
              // Esta línea sirve para agregar la celda de la fila: «Ejercicio, peso, repeticiones y video que envíes p…».
              'Ejercicio, peso, repeticiones y video que envíes para validar un récord, y el resultado de la revisión.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, si envías un récord para validación.…».
              'Tú, si envías un récord para validación.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Comunicaciones…».
              'Comunicaciones',
              // Esta línea sirve para agregar la celda de la fila: «Mensajes de chat con tu entrenador o tus clientes …».
              'Mensajes de chat con tu entrenador o tus clientes (contenido y estado de lectura), reportes de contenido que envíes y notificaciones de la aplicación.',
              // Esta línea sirve para agregar la celda de la fila: «Tú y las personas con las que conversas.…».
              'Tú y las personas con las que conversas.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Soporte…».
              'Soporte',
              // Esta línea sirve para agregar la celda de la fila: «Solicitudes que envías al equipo de {{brandName}} …».
              'Solicitudes que envías al equipo de {{brandName}} (tipo, asunto, mensajes y su estado) y las respuestas del equipo.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, en la sección Soporte.…».
              'Tú, en la sección Soporte.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Check-in semanal…».
              'Check-in semanal',
              // Esta línea sirve para agregar la celda de la fila: «Cómo te sentiste con tus entrenamientos esa semana…».
              'Cómo te sentiste con tus entrenamientos esa semana, si quisiste contarnos algo (y tu comentario, si lo escribiste), si lo pospusiste y, como contexto, tu rutina activa y cuántas sesiones completaste esa semana.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, al responder el check-in (opcional).…».
              'Tú, al responder el check-in (opcional).',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Pedidos de la tienda…».
              'Pedidos de la tienda',
              // Esta línea sirve para agregar la celda de la fila: «Nombre, correo, teléfono, número de WhatsApp, depa…».
              'Nombre, correo, teléfono, número de WhatsApp, departamento, ciudad, dirección, información adicional, productos, importes, estado del pedido, transportadora y número de guía.',
              // Esta línea sirve para agregar la celda de la fila: «Tú, al hacer un pedido; el equipo de {{brandName}}…».
              'Tú, al hacer un pedido; el equipo de {{brandName}}, al gestionarlo.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Notificaciones push…».
              'Notificaciones push',
              // Esta línea sirve para agregar la celda de la fila: «Identificador del dispositivo para notificaciones …».
              'Identificador del dispositivo para notificaciones (app móvil) o datos de suscripción del navegador (web), solo si activas las notificaciones.',
              // Esta línea sirve para agregar la celda de la fila: «Tu dispositivo o navegador, con tu permiso.…».
              'Tu dispositivo o navegador, con tu permiso.',
            ],
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es una nota destacada.
          type: 'note',
          // Esta línea sirve para incluir el texto: «{{brandName}} no procesa pagos en línea ni almacena datos de tarjetas.…».
          text: '{{brandName}} no procesa pagos en línea ni almacena datos de tarjetas. No usamos herramientas de analítica de terceros ni publicidad.',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Dirección IP: el servidor la procesa de forma técnica para responder a…».
          text: 'Dirección IP: el servidor la procesa de forma técnica para responder a tus solicitudes y para limitar intentos repetidos (por ejemplo, de inicio de sesión) como medida contra abusos. Puede figurar en los registros técnicos del servidor y de los túneles de conexión (ver sección 6). No la asociamos a tu perfil ni la usamos con fines publicitarios.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "finalidades".
      id: 'finalidades',
      // Esta línea sirve para definir el título de la sección: «3. Para qué usamos tus datos».
      title: '3. Para qué usamos tus datos',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Crear y administrar tu cuenta, y autenticarte (incluida la v…».
            'Crear y administrar tu cuenta, y autenticarte (incluida la verificación del correo, la recuperación de contraseña y la verificación en dos pasos si la activas).',
            // Esta línea sirve para agregar el ítem: «Generar y ajustar tus rutinas según tu perfil, nivel, objeti…».
            'Generar y ajustar tus rutinas según tu perfil, nivel, objetivos, disponibilidad, equipamiento y estado previo al entrenamiento.',
            // Esta línea sirve para agregar el ítem: «Registrar tus entrenamientos y mostrarte tu progreso, récord…».
            'Registrar tus entrenamientos y mostrarte tu progreso, récords, estadísticas, logros, rachas y retos.',
            // Esta línea sirve para agregar el ítem: «Calcular objetivos nutricionales orientativos y registrar tu…».
            'Calcular objetivos nutricionales orientativos y registrar tu alimentación.',
            // Esta línea sirve para agregar el ítem: «Permitir la comunicación con tu entrenador (o con tus client…».
            'Permitir la comunicación con tu entrenador (o con tus clientes, si eres entrenador).',
            // Esta línea sirve para agregar el ítem: «Mostrarte en rankings públicos únicamente si activas la opci…».
            'Mostrarte en rankings públicos únicamente si activas la opción "Rankings públicos" (puedes desactivarla cuando quieras), y en las clasificaciones de los retos en los que participes.',
            // Esta línea sirve para agregar el ítem: «Revisar los récords que envíes con video y las denuncias de …».
            'Revisar los récords que envíes con video y las denuncias de contenido.',
            // Esta línea sirve para agregar el ítem: «Atender tus solicitudes de soporte (dudas, reclamos, observa…».
            'Atender tus solicitudes de soporte (dudas, reclamos, observaciones, sugerencias o problemas) y responderte.',
            // Esta línea sirve para agregar el ítem: «Preguntarte una vez por semana cómo te sentiste con tus entr…».
            'Preguntarte una vez por semana cómo te sentiste con tus entrenamientos, para detectar dudas o problemas y mejorar las rutinas. Hoy tus respuestas no cambian tu rutina automáticamente; si en el futuro se usan para ajustarla, se informará en esta política.',
            // Esta línea sirve para agregar el ítem: «Gestionar y entregar tus pedidos de la tienda y contactarte …».
            'Gestionar y entregar tus pedidos de la tienda y contactarte sobre ellos.',
            // Esta línea sirve para agregar el ítem: «Enviarte notificaciones push cuando las hayas activado, y co…».
            'Enviarte notificaciones push cuando las hayas activado, y correos transaccionales (verificación de correo, recuperación de contraseña).',
            // Esta línea sirve para agregar el ítem: «Mantener la seguridad del servicio, prevenir abusos y fraude…».
            'Mantener la seguridad del servicio, prevenir abusos y fraudes, y aplicar los Términos y Condiciones.',
            // Esta línea sirve para agregar el ítem: «Obtener estadísticas internas y agregadas de uso (por ejempl…».
            'Obtener estadísticas internas y agregadas de uso (por ejemplo, cuántas personas usan la app cada día y desde qué plataforma) para operar y mejorar el servicio. Estas estadísticas se calculan con nuestros propios registros, sin herramientas de terceros.',
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Base legal: el tratamiento se basa en tu autorización previa, expresa …».
          text: 'Base legal: el tratamiento se basa en tu autorización previa, expresa e informada (en particular para los datos de salud y condición física, que son datos sensibles), en la prestación del servicio que solicitas al aceptar los Términos y Condiciones y en la necesidad de mantener la seguridad del servicio, conforme a la Ley 1581 de 2012 de {{jurisdiction}} y sus normas reglamentarias.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "salud".
      id: 'salud',
      // Esta línea sirve para definir el título de la sección: «4. Datos de salud y condición física».
      title: '4. Datos de salud y condición física',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Algunos datos que registras en {{brandName}} (peso, estatura, edad, se…».
          text: 'Algunos datos que registras en {{brandName}} (peso, estatura, edad, sexo, composición y medidas corporales, calidad de sueño, energía, dolor muscular, alimentación y cómo te sentiste con tus entrenamientos en el check-in semanal) pueden considerarse datos relativos a la salud o datos sensibles según la ley aplicable. Por eso te pedimos una autorización específica y separada para tratarlos.',
        },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Los usamos exclusivamente para personalizar tus rutinas y ob…».
            'Los usamos exclusivamente para personalizar tus rutinas y objetivos nutricionales y para mostrarte tu progreso.',
            // Esta línea sirve para agregar el ítem: «No los vendemos ni los usamos para publicidad.…».
            'No los vendemos ni los usamos para publicidad.',
            // Esta línea sirve para agregar el ítem: «Solo los ve tu entrenador si te vinculas con uno dentro de l…».
            'Solo los ve tu entrenador si te vinculas con uno dentro de la app, y el equipo de administración de {{brandName}} cuando sea necesario para soporte, moderación o seguridad.',
            // Esta línea sirve para agregar el ítem: «Son opcionales en la medida en que puedes no registrar medid…».
            'Son opcionales en la medida en que puedes no registrar medidas, no completar el pre-check o no usar la sección de nutrición; sin algunos de ellos (por ejemplo, nivel, objetivos o peso) la aplicación no puede generar una rutina personalizada.',
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es una nota destacada.
          type: 'note',
          // Esta línea sirve para incluir el texto: «{{brandName}} es una herramienta de entrenamiento y seguimiento. No pr…».
          text: '{{brandName}} es una herramienta de entrenamiento y seguimiento. No presta servicios médicos, no realiza diagnósticos y no sustituye la valoración de un médico, nutricionista u otro profesional de la salud.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "destinatarios".
      id: 'destinatarios',
      // Esta línea sirve para definir el título de la sección: «5. Con quién compartimos tus datos».
      title: '5. Con quién compartimos tus datos',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «No vendemos tus datos. Solo se comparten en estos casos:…».
          text: 'No vendemos tus datos. Solo se comparten en estos casos:',
        },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Tu entrenador: si te vinculas con un entrenador en {{brandNa…».
            'Tu entrenador: si te vinculas con un entrenador en {{brandName}}, podrá ver la información necesaria para acompañarte (tu nombre, rutinas, entrenamientos y progreso) y conversar contigo por chat.',
            // Esta línea sirve para agregar el ítem: «Otros usuarios: tu nombre y tus marcas aparecen en rankings …».
            'Otros usuarios: tu nombre y tus marcas aparecen en rankings solo si activas "Rankings públicos"; en los retos en los que participas, tu nombre y avance aparecen en la clasificación del reto.',
            // Esta línea sirve para agregar el ítem: «Equipo de administración de {{brandName}}: acceso limitado a…».
            'Equipo de administración de {{brandName}}: acceso limitado a lo necesario para soporte, moderación, revisión de récords y gestión de pedidos. Tus solicitudes de soporte y tus respuestas del check-in semanal solo las ve este equipo — no tu entrenador ni otros usuarios.',
            // Esta línea sirve para agregar el ítem: «Proveedores técnicos que prestan servicios a {{brandName}} (…».
            'Proveedores técnicos que prestan servicios a {{brandName}} (ver sección 6), solo con los datos que cada uno necesita.',
            // Esta línea sirve para agregar el ítem: «Empresas de transporte: cuando corresponda, la transportador…».
            'Empresas de transporte: cuando corresponda, la transportadora que entregue tu pedido recibe el nombre, teléfono y dirección de entrega.',
            // Esta línea sirve para agregar el ítem: «Autoridades: cuando una ley o una orden de autoridad compete…».
            'Autoridades: cuando una ley o una orden de autoridad competente lo exija.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "terceros".
      id: 'terceros',
      // Esta línea sirve para definir el título de la sección: «6. Servicios de terceros».
      title: '6. Servicios de terceros',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una tabla.
          type: 'table',
          // Esta línea sirve para definir los encabezados de la tabla.
          headers: ['Servicio', 'Para qué', 'Qué información puede recibir'],
          // Esta línea sirve para abrir las filas de la tabla.
          rows: [
            [
              // Esta línea sirve para agregar la celda de la fila: «Google (Firebase Authentication y Google Sign-In)…».
              'Google (Firebase Authentication y Google Sign-In)',
              // Esta línea sirve para agregar la celda de la fila: «Iniciar sesión o registrarte con tu cuenta de Goog…».
              'Iniciar sesión o registrarte con tu cuenta de Google, solo si eliges esa opción.',
              // Esta línea sirve para agregar la celda de la fila: «Los datos de tu cuenta de Google que autorizas com…».
              'Los datos de tu cuenta de Google que autorizas compartir (nombre, correo, foto) y datos técnicos de la conexión. Google los trata según su propia política de privacidad.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Google Fonts (solo versión web)…».
              'Google Fonts (solo versión web)',
              // Esta línea sirve para agregar la celda de la fila: «Cargar la tipografía de la interfaz.…».
              'Cargar la tipografía de la interfaz.',
              // Esta línea sirve para agregar la celda de la fila: «Tu dirección IP y datos técnicos del navegador al …».
              'Tu dirección IP y datos técnicos del navegador al descargar la fuente.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Servicio de notificaciones de Expo (app móvil)…».
              'Servicio de notificaciones de Expo (app móvil)',
              // Esta línea sirve para agregar la celda de la fila: «Entregar notificaciones push en tu teléfono, a tra…».
              'Entregar notificaciones push en tu teléfono, a través de Firebase Cloud Messaging (Google) o Apple Push Notification service.',
              // Esta línea sirve para agregar la celda de la fila: «El identificador de notificaciones de tu dispositi…».
              'El identificador de notificaciones de tu dispositivo y el contenido de la notificación (por ejemplo, el nombre de quien te escribe y el inicio del mensaje).',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Servicio push de tu navegador (versión web)…».
              'Servicio push de tu navegador (versión web)',
              // Esta línea sirve para agregar la celda de la fila: «Entregar notificaciones en el navegador, si las ac…».
              'Entregar notificaciones en el navegador, si las activas.',
              // Esta línea sirve para agregar la celda de la fila: «Una notificación cifrada; el proveedor depende de …».
              'Una notificación cifrada; el proveedor depende de tu navegador (por ejemplo, Google, Mozilla o Apple).',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «Open Food Facts…».
              'Open Food Facts',
              // Esta línea sirve para agregar la celda de la fila: «Buscar información nutricional de alimentos por no…».
              'Buscar información nutricional de alimentos por nombre o código de barras.',
              // Esta línea sirve para agregar la celda de la fila: «Solo el texto buscado o el código de barras. La co…».
              'Solo el texto buscado o el código de barras. La consulta la hace el servidor de {{brandName}}, sin datos que te identifiquen.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «{{emailProvider}}…».
              '{{emailProvider}}',
              // Esta línea sirve para agregar la celda de la fila: «Enviar correos de verificación y de recuperación d…».
              'Enviar correos de verificación y de recuperación de contraseña.',
              // Esta línea sirve para agregar la celda de la fila: «Tu correo electrónico y el contenido del mensaje.…».
              'Tu correo electrónico y el contenido del mensaje.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «ngrok y Cloudflare (túneles de conexión)…».
              'ngrok y Cloudflare (túneles de conexión)',
              // Esta línea sirve para agregar la celda de la fila: «Hoy el servidor de {{brandName}} (base de datos y …».
              'Hoy el servidor de {{brandName}} (base de datos y archivos) funciona en equipos propios del responsable, sin proveedor de hosting externo, y se conecta a Internet a través de estos túneles.',
              // Esta línea sirve para agregar la celda de la fila: «El tráfico entre la app y el servidor pasa por ell…».
              'El tráfico entre la app y el servidor pasa por ellos, incluidos los datos que envías y recibes. Si se contrata un proveedor de hosting, se informará en una nueva versión de esta política.',
            ],
            [
              // Esta línea sirve para agregar la celda de la fila: «WhatsApp (Meta)…».
              'WhatsApp (Meta)',
              // Esta línea sirve para agregar la celda de la fila: «Solo si decides contactarnos por WhatsApp desde la…».
              'Solo si decides contactarnos por WhatsApp desde la app.',
              // Esta línea sirve para agregar la celda de la fila: «La conversación ocurre en WhatsApp y se rige por s…».
              'La conversación ocurre en WhatsApp y se rige por sus políticas.',
            ],
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Algunos de estos proveedores pueden tratar datos fuera de tu país. Cua…».
          text: 'Algunos de estos proveedores pueden tratar datos fuera de tu país. Cuando eso ocurra, se aplicarán las garantías que exija la ley aplicable en {{jurisdiction}}.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "conservacion".
      id: 'conservacion',
      // Esta línea sirve para definir el título de la sección: «7. Cuánto tiempo conservamos tus datos».
      title: '7. Cuánto tiempo conservamos tus datos',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Conservamos tus datos mientras tu cuenta esté activa. Si se elimina tu…».
          text: 'Conservamos tus datos mientras tu cuenta esté activa. Si se elimina tu cuenta, se eliminan también los datos asociados a ella (perfil, entrenamientos, medidas, nutrición, mensajes, notificaciones y consentimientos), salvo que una ley exija conservarlos por más tiempo. El registro interno de auditoría de acciones administrativas puede conservar referencias a la cuenta por motivos de seguridad. Plazos específicos: {{retentionPeriod}}.',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Guardamos un registro de qué versión de cada documento legal aceptaste…».
          text: 'Guardamos un registro de qué versión de cada documento legal aceptaste y cuándo, como prueba de tu consentimiento, mientras exista tu cuenta.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "derechos".
      id: 'derechos',
      // Esta línea sirve para definir el título de la sección: «8. Tus derechos».
      title: '8. Tus derechos',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «De acuerdo con la ley colombiana de protección de datos personales (Le…».
          text: 'De acuerdo con la ley colombiana de protección de datos personales (Ley 1581 de 2012 y sus normas reglamentarias), puedes:',
        },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Consultar qué datos tuyos tratamos y obtener una copia.…».
            'Consultar qué datos tuyos tratamos y obtener una copia.',
            // Esta línea sirve para agregar el ítem: «Solicitar la corrección de datos inexactos o incompletos. Mu…».
            'Solicitar la corrección de datos inexactos o incompletos. Muchos puedes corregirlos tú mismo desde la configuración de la app.',
            // Esta línea sirve para agregar el ítem: «Eliminar tu cuenta y tus datos en cualquier momento desde Co…».
            'Eliminar tu cuenta y tus datos en cualquier momento desde Configuración > Eliminar mi cuenta, o solicitar la eliminación de datos concretos, cuando proceda.',
            // Esta línea sirve para agregar el ítem: «Retirar tu consentimiento, cuando el tratamiento se base en …».
            'Retirar tu consentimiento, cuando el tratamiento se base en él. Retirarlo no afecta al tratamiento hecho antes, y puede impedir que sigamos prestando funciones que dependen de esos datos.',
            // Esta línea sirve para agregar el ítem: «Solicitar información sobre el uso que damos a tus datos y s…».
            'Solicitar información sobre el uso que damos a tus datos y sobre esta política.',
            // Esta línea sirve para agregar el ítem: «Presentar una queja ante {{supervisoryAuthority}}, después d…».
            'Presentar una queja ante {{supervisoryAuthority}}, después de haber presentado tu consulta o reclamo ante nosotros.',
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Para ejercer cualquiera de estos derechos, escribe a {{privacyEmail}} …».
          text: 'Para ejercer cualquiera de estos derechos, escribe a {{privacyEmail}} desde el correo asociado a tu cuenta, indicando tu solicitud. Podremos pedirte información adicional para verificar tu identidad antes de atenderla.',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Desde la configuración de la app también puedes, en cualquier momento:…».
          text: 'Desde la configuración de la app también puedes, en cualquier momento: activar o desactivar tu aparición en rankings públicos, activar o desactivar las notificaciones push y, en la web, cambiar tus preferencias de cookies.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "seguridad".
      id: 'seguridad',
      // Esta línea sirve para definir el título de la sección: «9. Seguridad».
      title: '9. Seguridad',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Las contraseñas se guardan con un hash criptográfico, nunca …».
            'Las contraseñas se guardan con un hash criptográfico, nunca en texto plano.',
            // Esta línea sirve para agregar el ítem: «Puedes activar la verificación en dos pasos; su secreto se g…».
            'Puedes activar la verificación en dos pasos; su secreto se guarda cifrado.',
            // Esta línea sirve para agregar el ítem: «El acceso a la información está limitado por roles (usuario,…».
            'El acceso a la información está limitado por roles (usuario, entrenador, administración).',
            // Esta línea sirve para agregar el ítem: «Los intentos repetidos de inicio de sesión y de registro se …».
            'Los intentos repetidos de inicio de sesión y de registro se limitan automáticamente.',
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Ningún sistema es completamente infalible. Si detectamos un incidente …».
          text: 'Ningún sistema es completamente infalible. Si detectamos un incidente de seguridad que afecte a tus datos, actuaremos según lo que exija la ley aplicable.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "menores".
      id: 'menores',
      // Esta línea sirve para definir el título de la sección: «10. Menores de edad».
      title: '10. Menores de edad',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «La aplicación admite usuarios de entre 15 y 70 años. Para usar {{brand…».
          text: 'La aplicación admite usuarios de entre 15 y 70 años. Para usar {{brandName}} sin autorización de un adulto debes tener al menos {{minimumAge}}. Si eres menor de esa edad, necesitas la autorización de tu madre, padre o representante legal.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "cookies".
      id: 'cookies',
      // Esta línea sirve para definir el título de la sección: «11. Cookies y almacenamiento local».
      title: '11. Cookies y almacenamiento local',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «La versión web utiliza cookies y almacenamiento local del navegador. L…».
          text: 'La versión web utiliza cookies y almacenamiento local del navegador. Los detalles están en la Política de Cookies. La app móvil guarda en el almacenamiento seguro del teléfono tu sesión y algunas preferencias; no usa cookies de seguimiento ni publicidad.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "cambios".
      id: 'cambios',
      // Esta línea sirve para definir el título de la sección: «12. Cambios en esta política».
      title: '12. Cambios en esta política',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Cada versión de esta política tiene un número y una fecha. Si hacemos …».
          text: 'Cada versión de esta política tiene un número y una fecha. Si hacemos cambios importantes, te pediremos que revises y aceptes la nueva versión antes de seguir usando la aplicación.',
        },
      ],
    },
  ],
};

// Esta línea sirve para importar el tipo del contenido de un documento legal.
import type { LegalDocumentContent } from '../types';

/**
 * Términos y Condiciones — texto de referencia (español).
 * Revisado y aprobado por el responsable de SanKen (v1.0).
 */
// Esta línea sirve para declarar el contenido del documento legal "termsEs".
export const termsEs: LegalDocumentContent = {
  // Esta línea sirve para definir el título del documento: «Términos y Condiciones».
  title: 'Términos y Condiciones',
  // Esta línea sirve para definir el resumen del documento: «Las reglas para usar {{brandName}}: qué ofrece, qué se esper…».
  summary: 'Las reglas para usar {{brandName}}: qué ofrece, qué se espera de ti y qué puedes esperar de nosotros.',
  // Esta línea sirve para abrir la lista de secciones del documento.
  sections: [
    {
      // Esta línea sirve para identificar la sección con el id "aceptacion".
      id: 'aceptacion',
      // Esta línea sirve para definir el título de la sección: «1. Aceptación».
      title: '1. Aceptación',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Estos Términos regulan el uso de {{brandName}} (aplicación web y aplic…».
          text: 'Estos Términos regulan el uso de {{brandName}} (aplicación web y aplicación móvil), ofrecida por {{legalName}}. Al crear una cuenta aceptas estos Términos y declaras haber leído la Política de Privacidad. Si no estás de acuerdo, no crees una cuenta ni uses el servicio.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "servicio".
      id: 'servicio',
      // Esta línea sirve para definir el título de la sección: «2. Qué es SanKen».
      title: '2. Qué es SanKen',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «{{brandName}} es una plataforma de entrenamiento físico. Según tu rol …».
          text: '{{brandName}} es una plataforma de entrenamiento físico. Según tu rol y las funciones disponibles, te permite:',
        },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Completar un perfil de entrenamiento y recibir rutinas gener…».
            'Completar un perfil de entrenamiento y recibir rutinas generadas o asignadas por un entrenador o por el equipo de {{brandName}}.',
            // Esta línea sirve para agregar el ítem: «Registrar entrenamientos, series, medidas corporales y alime…».
            'Registrar entrenamientos, series, medidas corporales y alimentación, y ver tu progreso.',
            // Esta línea sirve para agregar el ítem: «Participar en retos, obtener logros y, si lo activas, aparec…».
            'Participar en retos, obtener logros y, si lo activas, aparecer en rankings.',
            // Esta línea sirve para agregar el ítem: «Enviar récords con video para su validación.…».
            'Enviar récords con video para su validación.',
            // Esta línea sirve para agregar el ítem: «Conversar por chat con tu entrenador (o con tus clientes, si…».
            'Conversar por chat con tu entrenador (o con tus clientes, si eres entrenador).',
            // Esta línea sirve para agregar el ítem: «Hacer pedidos de productos en la tienda.…».
            'Hacer pedidos de productos en la tienda.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "cuenta".
      id: 'cuenta',
      // Esta línea sirve para definir el título de la sección: «3. Tu cuenta».
      title: '3. Tu cuenta',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Debes dar información veraz y mantenerla actualizada.…».
            'Debes dar información veraz y mantenerla actualizada.',
            // Esta línea sirve para agregar el ítem: «Tu cuenta es personal. Eres responsable de mantener la confi…».
            'Tu cuenta es personal. Eres responsable de mantener la confidencialidad de tu contraseña y de la actividad que ocurra con tus credenciales. Te recomendamos activar la verificación en dos pasos.',
            // Esta línea sirve para agregar el ítem: «Si sospechas de un acceso no autorizado, cambia tu contraseñ…».
            'Si sospechas de un acceso no autorizado, cambia tu contraseña y avísanos en {{supportEmail}}.',
            // Esta línea sirve para agregar el ítem: «Debes tener al menos {{minimumAge}} para registrarte sin aut…».
            'Debes tener al menos {{minimumAge}} para registrarte sin autorización de un adulto. Si eres menor de esa edad, necesitas la autorización de tu madre, padre o representante legal.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "uso-permitido".
      id: 'uso-permitido',
      // Esta línea sirve para definir el título de la sección: «4. Uso permitido».
      title: '4. Uso permitido',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        // Esta línea sirve para incluir el párrafo sobre el uso permitido de la plataforma y sus prohibiciones.
        { type: 'p', text: 'Puedes usar {{brandName}} para tu entrenamiento personal y, si eres entrenador verificado, para acompañar a tus clientes. No está permitido:' },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Suplantar a otra persona o crear cuentas con datos falsos.…».
            'Suplantar a otra persona o crear cuentas con datos falsos.',
            // Esta línea sirve para agregar el ítem: «Acosar, amenazar, insultar o discriminar a otros usuarios, o…».
            'Acosar, amenazar, insultar o discriminar a otros usuarios, o enviar contenido sexual, violento o ilegal.',
            // Esta línea sirve para agregar el ítem: «Enviar récords o videos falsos o manipulados para alterar ra…».
            'Enviar récords o videos falsos o manipulados para alterar rankings o retos.',
            // Esta línea sirve para agregar el ítem: «Acceder o intentar acceder a cuentas o datos de otras person…».
            'Acceder o intentar acceder a cuentas o datos de otras personas, o eludir las medidas de seguridad.',
            // Esta línea sirve para agregar el ítem: «Usar bots, scripts o cualquier medio automatizado para usar …».
            'Usar bots, scripts o cualquier medio automatizado para usar el servicio o extraer información.',
            // Esta línea sirve para agregar el ítem: «Interferir con el funcionamiento del servicio o sobrecargarl…».
            'Interferir con el funcionamiento del servicio o sobrecargarlo intencionalmente.',
            // Esta línea sirve para agregar el ítem: «Usar {{brandName}} con fines comerciales no autorizados o pa…».
            'Usar {{brandName}} con fines comerciales no autorizados o para enviar publicidad no solicitada.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "contenido".
      id: 'contenido',
      // Esta línea sirve para definir el título de la sección: «5. Contenido que publicas».
      title: '5. Contenido que publicas',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Eres responsable del contenido que envías (foto de perfil, mensajes de…».
          text: 'Eres responsable del contenido que envías (foto de perfil, mensajes de chat, videos de récords, notas y reportes). Conservas los derechos sobre él y nos autorizas a almacenarlo, procesarlo y mostrarlo únicamente en la medida necesaria para prestar el servicio (por ejemplo, mostrar tu foto a tu entrenador o permitir que el equipo revise un video de récord).',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Puedes reportar contenido inapropiado desde la app. El equipo de {{bra…».
          text: 'Puedes reportar contenido inapropiado desde la app. El equipo de {{brandName}} puede revisar, rechazar o retirar contenido que incumpla estos Términos.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "entrenamiento".
      id: 'entrenamiento',
      // Esta línea sirve para definir el título de la sección: «6. Entrenamiento, nutrición y salud».
      title: '6. Entrenamiento, nutrición y salud',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una nota destacada.
          type: 'note',
          // Esta línea sirve para incluir el texto: «{{brandName}} no es un servicio médico. Las rutinas, cargas sugeridas,…».
          text: '{{brandName}} no es un servicio médico. Las rutinas, cargas sugeridas, ajustes del pre-check y objetivos nutricionales son orientativos, se generan a partir de la información que tú proporcionas y no constituyen diagnóstico, tratamiento ni consejo médico o nutricional profesional.',
        },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Antes de empezar un programa de ejercicio o cambiar tu alime…».
            'Antes de empezar un programa de ejercicio o cambiar tu alimentación, consulta a un profesional de la salud, especialmente si tienes una lesión, una condición médica, estás embarazada o no has entrenado antes.',
            // Esta línea sirve para agregar el ítem: «Entrena dentro de tus posibilidades, usa una técnica adecuad…».
            'Entrena dentro de tus posibilidades, usa una técnica adecuada y detente si sientes dolor, mareo o cualquier síntoma anormal.',
            // Esta línea sirve para agregar el ítem: «Eres responsable de decidir si realizas cada ejercicio y con…».
            'Eres responsable de decidir si realizas cada ejercicio y con qué carga.',
            // Esta línea sirve para agregar el ítem: «Los entrenadores que usan {{brandName}} son responsables de …».
            'Los entrenadores que usan {{brandName}} son responsables de las rutinas y recomendaciones que asignan a sus clientes.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "tienda".
      id: 'tienda',
      // Esta línea sirve para definir el título de la sección: «7. Pedidos de la tienda».
      title: '7. Pedidos de la tienda',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Los pedidos de la tienda se registran en la aplicación y el equipo de …».
          text: 'Los pedidos de la tienda se registran en la aplicación y el equipo de {{brandName}} te contacta para confirmarlos, coordinar el envío y el pago. La aplicación no procesa pagos en línea. El precio del pedido es el que muestra la app al confirmarlo; el costo de envío, los plazos y las condiciones de cambios y devoluciones se informan al confirmar el pedido, conforme a la normativa de protección al consumidor aplicable en {{jurisdiction}}.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "disponibilidad".
      id: 'disponibilidad',
      // Esta línea sirve para definir el título de la sección: «8. Disponibilidad y cambios del servicio».
      title: '8. Disponibilidad y cambios del servicio',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Trabajamos para que {{brandName}} esté disponible, pero pueden produci…».
          text: 'Trabajamos para que {{brandName}} esté disponible, pero pueden producirse interrupciones por mantenimiento, actualizaciones, fallos técnicos o causas ajenas a nosotros. Podemos agregar, modificar o retirar funcionalidades. Cuando un cambio afecte de forma importante al uso que haces del servicio, intentaremos avisarte con antelación razonable.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "propiedad".
      id: 'propiedad',
      // Esta línea sirve para definir el título de la sección: «9. Propiedad intelectual».
      title: '9. Propiedad intelectual',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «La marca {{brandName}}, sus logotipos, el software, el diseño de la in…».
          text: 'La marca {{brandName}}, sus logotipos, el software, el diseño de la interfaz, los textos, las imágenes, los videos de ejercicios, el catálogo de ejercicios y los demás elementos gráficos de la plataforma pertenecen a {{legalName}} o a sus licenciantes, y están protegidos por la ley. No puedes copiarlos, modificarlos, distribuirlos ni usarlos fuera del servicio sin autorización previa y por escrito.',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «La información nutricional de alimentos proviene en parte de Open Food…».
          text: 'La información nutricional de alimentos proviene en parte de Open Food Facts, una base de datos abierta, y se usa conforme a su licencia.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "suspension".
      id: 'suspension',
      // Esta línea sirve para definir el título de la sección: «10. Suspensión y cierre de cuentas».
      title: '10. Suspensión y cierre de cuentas',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Podemos suspender, desactivar o eliminar una cuenta si incumple estos …».
          text: 'Podemos suspender, desactivar o eliminar una cuenta si incumple estos Términos, si hay indicios razonables de fraude o de un uso que ponga en riesgo a otros usuarios o al servicio, o si lo exige una autoridad. Cuando sea posible, te informaremos del motivo.',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Puedes dejar de usar {{brandName}} en cualquier momento y eliminar tu …».
          text: 'Puedes dejar de usar {{brandName}} en cualquier momento y eliminar tu cuenta tú mismo desde Configuración > Eliminar mi cuenta (se borran de forma permanente tu cuenta y tus datos), o solicitarlo escribiendo a {{privacyEmail}}.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "responsabilidad".
      id: 'responsabilidad',
      // Esta línea sirve para definir el título de la sección: «11. Responsabilidad».
      title: '11. Responsabilidad',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «En la medida permitida por la ley aplicable, {{brandName}} no será res…».
          text: 'En la medida permitida por la ley aplicable, {{brandName}} no será responsable de lesiones o daños derivados de realizar ejercicios o seguir recomendaciones sin la debida precaución, ni de interrupciones del servicio ajenas a nuestro control. Nada en estos Términos limita derechos que la ley te reconozca y que no puedan excluirse.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "modificaciones".
      id: 'modificaciones',
      // Esta línea sirve para definir el título de la sección: «12. Modificaciones de estos Términos».
      title: '12. Modificaciones de estos Términos',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Cada versión de estos Términos tiene un número y una fecha. Si los mod…».
          text: 'Cada versión de estos Términos tiene un número y una fecha. Si los modificamos de forma relevante, te pediremos que aceptes la nueva versión antes de seguir usando la aplicación. Mientras no la aceptes no podrás usar la aplicación; si no estás de acuerdo, podrás eliminar tu cuenta desde esa misma pantalla.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "ley".
      id: 'ley',
      // Esta línea sirve para definir el título de la sección: «13. Ley aplicable».
      title: '13. Ley aplicable',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Estos Términos se rigen por la ley de {{jurisdiction}}.…».
          text: 'Estos Términos se rigen por la ley de {{jurisdiction}}.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "contacto".
      id: 'contacto',
      // Esta línea sirve para definir el título de la sección: «14. Contacto».
      title: '14. Contacto',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Para dudas sobre estos Términos escribe a {{supportEmail}}. Para temas…».
          text: 'Para dudas sobre estos Términos escribe a {{supportEmail}}. Para temas de privacidad, a {{privacyEmail}}.',
        },
      ],
    },
  ],
};

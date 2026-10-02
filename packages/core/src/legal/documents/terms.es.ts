import type { LegalDocumentContent } from '../types';

/**
 * Términos y Condiciones — texto de referencia (español).
 * Revisado y aprobado por el responsable de SanKen (v1.0).
 */
export const termsEs: LegalDocumentContent = {
  title: 'Términos y Condiciones',
  summary: 'Las reglas para usar {{brandName}}: qué ofrece, qué se espera de ti y qué puedes esperar de nosotros.',
  sections: [
    {
      id: 'aceptacion',
      title: '1. Aceptación',
      blocks: [
        {
          type: 'p',
          text: 'Estos Términos regulan el uso de {{brandName}} (aplicación web y aplicación móvil), ofrecida por {{legalName}}. Al crear una cuenta aceptas estos Términos y declaras haber leído la Política de Privacidad. Si no estás de acuerdo, no crees una cuenta ni uses el servicio.',
        },
      ],
    },
    {
      id: 'servicio',
      title: '2. Qué es SanKen',
      blocks: [
        {
          type: 'p',
          text: '{{brandName}} es una plataforma de entrenamiento físico. Según tu rol y las funciones disponibles, te permite:',
        },
        {
          type: 'list',
          items: [
            'Completar un perfil de entrenamiento y recibir rutinas generadas o asignadas por un entrenador o por el equipo de {{brandName}}.',
            'Registrar entrenamientos, series, medidas corporales y alimentación, y ver tu progreso.',
            'Participar en retos, obtener logros y, si lo activas, aparecer en rankings.',
            'Enviar récords con video para su validación.',
            'Conversar por chat con tu entrenador (o con tus clientes, si eres entrenador).',
            'Hacer pedidos de productos en la tienda.',
          ],
        },
      ],
    },
    {
      id: 'cuenta',
      title: '3. Tu cuenta',
      blocks: [
        {
          type: 'list',
          items: [
            'Debes dar información veraz y mantenerla actualizada.',
            'Tu cuenta es personal. Eres responsable de mantener la confidencialidad de tu contraseña y de la actividad que ocurra con tus credenciales. Te recomendamos activar la verificación en dos pasos.',
            'Si sospechas de un acceso no autorizado, cambia tu contraseña y avísanos en {{supportEmail}}.',
            'Debes tener al menos {{minimumAge}} para registrarte sin autorización de un adulto. Si eres menor de esa edad, necesitas la autorización de tu madre, padre o representante legal.',
          ],
        },
      ],
    },
    {
      id: 'uso-permitido',
      title: '4. Uso permitido',
      blocks: [
        { type: 'p', text: 'Puedes usar {{brandName}} para tu entrenamiento personal y, si eres entrenador verificado, para acompañar a tus clientes. No está permitido:' },
        {
          type: 'list',
          items: [
            'Suplantar a otra persona o crear cuentas con datos falsos.',
            'Acosar, amenazar, insultar o discriminar a otros usuarios, o enviar contenido sexual, violento o ilegal.',
            'Enviar récords o videos falsos o manipulados para alterar rankings o retos.',
            'Acceder o intentar acceder a cuentas o datos de otras personas, o eludir las medidas de seguridad.',
            'Usar bots, scripts o cualquier medio automatizado para usar el servicio o extraer información.',
            'Interferir con el funcionamiento del servicio o sobrecargarlo intencionalmente.',
            'Usar {{brandName}} con fines comerciales no autorizados o para enviar publicidad no solicitada.',
          ],
        },
      ],
    },
    {
      id: 'contenido',
      title: '5. Contenido que publicas',
      blocks: [
        {
          type: 'p',
          text: 'Eres responsable del contenido que envías (foto de perfil, mensajes de chat, videos de récords, notas y reportes). Conservas los derechos sobre él y nos autorizas a almacenarlo, procesarlo y mostrarlo únicamente en la medida necesaria para prestar el servicio (por ejemplo, mostrar tu foto a tu entrenador o permitir que el equipo revise un video de récord).',
        },
        {
          type: 'p',
          text: 'Puedes reportar contenido inapropiado desde la app. El equipo de {{brandName}} puede revisar, rechazar o retirar contenido que incumpla estos Términos.',
        },
      ],
    },
    {
      id: 'entrenamiento',
      title: '6. Entrenamiento, nutrición y salud',
      blocks: [
        {
          type: 'note',
          text: '{{brandName}} no es un servicio médico. Las rutinas, cargas sugeridas, ajustes del pre-check y objetivos nutricionales son orientativos, se generan a partir de la información que tú proporcionas y no constituyen diagnóstico, tratamiento ni consejo médico o nutricional profesional.',
        },
        {
          type: 'list',
          items: [
            'Antes de empezar un programa de ejercicio o cambiar tu alimentación, consulta a un profesional de la salud, especialmente si tienes una lesión, una condición médica, estás embarazada o no has entrenado antes.',
            'Entrena dentro de tus posibilidades, usa una técnica adecuada y detente si sientes dolor, mareo o cualquier síntoma anormal.',
            'Eres responsable de decidir si realizas cada ejercicio y con qué carga.',
            'Los entrenadores que usan {{brandName}} son responsables de las rutinas y recomendaciones que asignan a sus clientes.',
          ],
        },
      ],
    },
    {
      id: 'tienda',
      title: '7. Pedidos de la tienda',
      blocks: [
        {
          type: 'p',
          text: 'Los pedidos de la tienda se registran en la aplicación y el equipo de {{brandName}} te contacta para confirmarlos, coordinar el envío y el pago. La aplicación no procesa pagos en línea. El precio del pedido es el que muestra la app al confirmarlo; el costo de envío, los plazos y las condiciones de cambios y devoluciones se informan al confirmar el pedido, conforme a la normativa de protección al consumidor aplicable en {{jurisdiction}}.',
        },
      ],
    },
    {
      id: 'disponibilidad',
      title: '8. Disponibilidad y cambios del servicio',
      blocks: [
        {
          type: 'p',
          text: 'Trabajamos para que {{brandName}} esté disponible, pero pueden producirse interrupciones por mantenimiento, actualizaciones, fallos técnicos o causas ajenas a nosotros. Podemos agregar, modificar o retirar funcionalidades. Cuando un cambio afecte de forma importante al uso que haces del servicio, intentaremos avisarte con antelación razonable.',
        },
      ],
    },
    {
      id: 'propiedad',
      title: '9. Propiedad intelectual',
      blocks: [
        {
          type: 'p',
          text: 'La marca {{brandName}}, sus logotipos, el software, el diseño de la interfaz, los textos, las imágenes, los videos de ejercicios, el catálogo de ejercicios y los demás elementos gráficos de la plataforma pertenecen a {{legalName}} o a sus licenciantes, y están protegidos por la ley. No puedes copiarlos, modificarlos, distribuirlos ni usarlos fuera del servicio sin autorización previa y por escrito.',
        },
        {
          type: 'p',
          text: 'La información nutricional de alimentos proviene en parte de Open Food Facts, una base de datos abierta, y se usa conforme a su licencia.',
        },
      ],
    },
    {
      id: 'suspension',
      title: '10. Suspensión y cierre de cuentas',
      blocks: [
        {
          type: 'p',
          text: 'Podemos suspender, desactivar o eliminar una cuenta si incumple estos Términos, si hay indicios razonables de fraude o de un uso que ponga en riesgo a otros usuarios o al servicio, o si lo exige una autoridad. Cuando sea posible, te informaremos del motivo.',
        },
        {
          type: 'p',
          text: 'Puedes dejar de usar {{brandName}} en cualquier momento y eliminar tu cuenta tú mismo desde Configuración > Eliminar mi cuenta (se borran de forma permanente tu cuenta y tus datos), o solicitarlo escribiendo a {{privacyEmail}}.',
        },
      ],
    },
    {
      id: 'responsabilidad',
      title: '11. Responsabilidad',
      blocks: [
        {
          type: 'p',
          text: 'En la medida permitida por la ley aplicable, {{brandName}} no será responsable de lesiones o daños derivados de realizar ejercicios o seguir recomendaciones sin la debida precaución, ni de interrupciones del servicio ajenas a nuestro control. Nada en estos Términos limita derechos que la ley te reconozca y que no puedan excluirse.',
        },
      ],
    },
    {
      id: 'modificaciones',
      title: '12. Modificaciones de estos Términos',
      blocks: [
        {
          type: 'p',
          text: 'Cada versión de estos Términos tiene un número y una fecha. Si los modificamos de forma relevante, te pediremos que aceptes la nueva versión antes de seguir usando la aplicación. Mientras no la aceptes no podrás usar la aplicación; si no estás de acuerdo, podrás eliminar tu cuenta desde esa misma pantalla.',
        },
      ],
    },
    {
      id: 'ley',
      title: '13. Ley aplicable',
      blocks: [
        {
          type: 'p',
          text: 'Estos Términos se rigen por la ley de {{jurisdiction}}.',
        },
      ],
    },
    {
      id: 'contacto',
      title: '14. Contacto',
      blocks: [
        {
          type: 'p',
          text: 'Para dudas sobre estos Términos escribe a {{supportEmail}}. Para temas de privacidad, a {{privacyEmail}}.',
        },
      ],
    },
  ],
};

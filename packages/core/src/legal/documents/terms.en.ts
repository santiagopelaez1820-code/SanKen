// Esta línea sirve para importar el tipo del contenido de un documento legal.
import type { LegalDocumentContent } from '../types';

/**
 * Terms and Conditions — English translation of terms.es.ts.
 * Reviewed by the SanKen owner; the Spanish text is the reference version.
 */
// Esta línea sirve para declarar el contenido del documento legal "termsEn".
export const termsEn: LegalDocumentContent = {
  // Esta línea sirve para definir el título del documento: «Terms and Conditions».
  title: 'Terms and Conditions',
  // Esta línea sirve para definir el resumen del documento: «The rules for using {{brandName}}: what it offers, what we e…».
  summary: 'The rules for using {{brandName}}: what it offers, what we expect from you and what you can expect from us.',
  // Esta línea sirve para abrir la lista de secciones del documento.
  sections: [
    {
      // Esta línea sirve para identificar la sección con el id "aceptacion".
      id: 'aceptacion',
      // Esta línea sirve para definir el título de la sección: «1. Acceptance».
      title: '1. Acceptance',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «These Terms govern the use of {{brandName}} (web app and mobile app), …».
          text: 'These Terms govern the use of {{brandName}} (web app and mobile app), provided by {{legalName}}. By creating an account you accept these Terms and confirm you have read the Privacy Policy. If you do not agree, do not create an account or use the service.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "servicio".
      id: 'servicio',
      // Esta línea sirve para definir el título de la sección: «2. What SanKen is».
      title: '2. What SanKen is',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        // Esta línea sirve para incluir el párrafo que presenta la plataforma y lo que permite hacer.
        { type: 'p', text: '{{brandName}} is a fitness training platform. Depending on your role and the available features, it lets you:' },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Complete a training profile and receive routines generated o…».
            'Complete a training profile and receive routines generated or assigned by a trainer or by the {{brandName}} team.',
            // Esta línea sirve para agregar el ítem: «Log workouts, sets, body measurements and meals, and see you…».
            'Log workouts, sets, body measurements and meals, and see your progress.',
            // Esta línea sirve para agregar el ítem: «Join challenges, earn achievements and, if you turn it on, a…».
            'Join challenges, earn achievements and, if you turn it on, appear in rankings.',
            // Esta línea sirve para agregar el ítem: «Submit records with video for validation.…».
            'Submit records with video for validation.',
            // Esta línea sirve para agregar el ítem: «Chat with your trainer (or with your clients, if you are a t…».
            'Chat with your trainer (or with your clients, if you are a trainer).',
            // Esta línea sirve para agregar el ítem: «Order products from the store.…».
            'Order products from the store.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "cuenta".
      id: 'cuenta',
      // Esta línea sirve para definir el título de la sección: «3. Your account».
      title: '3. Your account',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «You must provide truthful information and keep it up to date…».
            'You must provide truthful information and keep it up to date.',
            // Esta línea sirve para agregar el ítem: «Your account is personal. You are responsible for keeping yo…».
            'Your account is personal. You are responsible for keeping your password confidential and for activity carried out with your credentials. We recommend enabling two-step verification.',
            // Esta línea sirve para agregar el ítem: «If you suspect unauthorized access, change your password and…».
            'If you suspect unauthorized access, change your password and let us know at {{supportEmail}}.',
            // Esta línea sirve para agregar el ítem: «You must be at least {{minimumAge}} to sign up without an ad…».
            'You must be at least {{minimumAge}} to sign up without an adult\'s authorization. If you are younger, you need authorization from your parent or legal guardian.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "uso-permitido".
      id: 'uso-permitido',
      // Esta línea sirve para definir el título de la sección: «4. Acceptable use».
      title: '4. Acceptable use',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        // Esta línea sirve para incluir el párrafo sobre el uso permitido de la plataforma y sus prohibiciones.
        { type: 'p', text: 'You may use {{brandName}} for your personal training and, if you are a verified trainer, to coach your clients. You may not:' },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Impersonate another person or create accounts with false dat…».
            'Impersonate another person or create accounts with false data.',
            // Esta línea sirve para agregar el ítem: «Harass, threaten, insult or discriminate against other users…».
            'Harass, threaten, insult or discriminate against other users, or send sexual, violent or illegal content.',
            // Esta línea sirve para agregar el ítem: «Submit fake or manipulated records or videos to alter rankin…».
            'Submit fake or manipulated records or videos to alter rankings or challenges.',
            // Esta línea sirve para agregar el ítem: «Access or attempt to access other people\'s accounts or data,…».
            'Access or attempt to access other people\'s accounts or data, or bypass security measures.',
            // Esta línea sirve para agregar el ítem: «Use bots, scripts or any automated means to use the service …».
            'Use bots, scripts or any automated means to use the service or extract information.',
            // Esta línea sirve para agregar el ítem: «Interfere with the operation of the service or intentionally…».
            'Interfere with the operation of the service or intentionally overload it.',
            // Esta línea sirve para agregar el ítem: «Use {{brandName}} for unauthorized commercial purposes or to…».
            'Use {{brandName}} for unauthorized commercial purposes or to send unsolicited advertising.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "contenido".
      id: 'contenido',
      // Esta línea sirve para definir el título de la sección: «5. Content you post».
      title: '5. Content you post',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «You are responsible for the content you submit (profile photo, chat me…».
          text: 'You are responsible for the content you submit (profile photo, chat messages, record videos, notes and reports). You keep your rights over it and authorize us to store, process and display it only as needed to provide the service (for example, showing your photo to your trainer or letting the team review a record video).',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «You can report inappropriate content from the app. The {{brandName}} t…».
          text: 'You can report inappropriate content from the app. The {{brandName}} team may review, reject or remove content that breaches these Terms.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "entrenamiento".
      id: 'entrenamiento',
      // Esta línea sirve para definir el título de la sección: «6. Training, nutrition and health».
      title: '6. Training, nutrition and health',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una nota destacada.
          type: 'note',
          // Esta línea sirve para incluir el texto: «{{brandName}} is not a medical service. Routines, suggested loads, pre…».
          text: '{{brandName}} is not a medical service. Routines, suggested loads, pre-workout adjustments and nutrition targets are for guidance only, are generated from the information you provide, and are not a diagnosis, treatment or professional medical or nutritional advice.',
        },
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Before starting an exercise program or changing your diet, c…».
            'Before starting an exercise program or changing your diet, consult a health professional, especially if you have an injury or medical condition, are pregnant or have not trained before.',
            // Esta línea sirve para agregar el ítem: «Train within your limits, use proper technique and stop if y…».
            'Train within your limits, use proper technique and stop if you feel pain, dizziness or any abnormal symptom.',
            // Esta línea sirve para agregar el ítem: «You are responsible for deciding whether to perform each exe…».
            'You are responsible for deciding whether to perform each exercise and with what load.',
            // Esta línea sirve para agregar el ítem: «Trainers using {{brandName}} are responsible for the routine…».
            'Trainers using {{brandName}} are responsible for the routines and recommendations they assign to their clients.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "tienda".
      id: 'tienda',
      // Esta línea sirve para definir el título de la sección: «7. Store orders».
      title: '7. Store orders',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Store orders are placed in the app and the {{brandName}} team contacts…».
          text: 'Store orders are placed in the app and the {{brandName}} team contacts you to confirm them and arrange shipping and payment. The app does not process online payments. The order price is the one shown in the app when you confirm it; shipping cost, delivery times and exchange and return conditions are provided when the order is confirmed, under the consumer protection rules applicable in {{jurisdiction}}.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "disponibilidad".
      id: 'disponibilidad',
      // Esta línea sirve para definir el título de la sección: «8. Availability and changes to the service».
      title: '8. Availability and changes to the service',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «We work to keep {{brandName}} available, but interruptions may occur d…».
          text: 'We work to keep {{brandName}} available, but interruptions may occur due to maintenance, updates, technical failures or causes beyond our control. We may add, change or remove features. When a change significantly affects how you use the service, we will try to give you reasonable notice.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "propiedad".
      id: 'propiedad',
      // Esta línea sirve para definir el título de la sección: «9. Intellectual property».
      title: '9. Intellectual property',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «The {{brandName}} brand, its logos, the software, the interface design…».
          text: 'The {{brandName}} brand, its logos, the software, the interface design, texts, images, exercise videos, the exercise catalog and other graphic elements of the platform belong to {{legalName}} or its licensors and are protected by law. You may not copy, modify, distribute or use them outside the service without prior written authorization.',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Food nutrition information comes partly from Open Food Facts, an open …».
          text: 'Food nutrition information comes partly from Open Food Facts, an open database, and is used under its license.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "suspension".
      id: 'suspension',
      // Esta línea sirve para definir el título de la sección: «10. Suspension and account closure».
      title: '10. Suspension and account closure',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «We may suspend, deactivate or delete an account that breaches these Te…».
          text: 'We may suspend, deactivate or delete an account that breaches these Terms, where there are reasonable signs of fraud or of use that puts other users or the service at risk, or when required by an authority. Where possible, we will tell you why.',
        },
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «You can stop using {{brandName}} at any time and delete your account y…».
          text: 'You can stop using {{brandName}} at any time and delete your account yourself from Settings > Delete my account (your account and data are permanently deleted), or request it by writing to {{privacyEmail}}.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "responsabilidad".
      id: 'responsabilidad',
      // Esta línea sirve para definir el título de la sección: «11. Liability».
      title: '11. Liability',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «To the extent permitted by applicable law, {{brandName}} is not liable…».
          text: 'To the extent permitted by applicable law, {{brandName}} is not liable for injuries or damage resulting from performing exercises or following recommendations without due care, or for service interruptions beyond our control. Nothing in these Terms limits rights the law grants you that cannot be excluded.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "modificaciones".
      id: 'modificaciones',
      // Esta línea sirve para definir el título de la sección: «12. Changes to these Terms».
      title: '12. Changes to these Terms',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Each version of these Terms has a number and a date. If we change them…».
          text: 'Each version of these Terms has a number and a date. If we change them materially, we will ask you to accept the new version before you keep using the app. Until you accept it you will not be able to use the app; if you disagree, you can delete your account from that same screen.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "ley".
      id: 'ley',
      // Esta línea sirve para definir el título de la sección: «13. Governing law».
      title: '13. Governing law',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [{ type: 'p', text: 'These Terms are governed by the law of {{jurisdiction}}.' }],
    },
    {
      // Esta línea sirve para identificar la sección con el id "contacto".
      id: 'contacto',
      // Esta línea sirve para definir el título de la sección: «14. Contact».
      title: '14. Contact',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «For questions about these Terms write to {{supportEmail}}. For privacy…».
          text: 'For questions about these Terms write to {{supportEmail}}. For privacy matters, to {{privacyEmail}}.',
        },
      ],
    },
  ],
};

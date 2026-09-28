import type { LegalDocumentContent } from '../types';

/**
 * Terms and Conditions — English translation of terms.es.ts.
 * NOT legally reviewed: the Spanish text is the reference version.
 */
export const termsEn: LegalDocumentContent = {
  title: 'Terms and Conditions',
  summary: 'The rules for using {{brandName}}: what it offers, what we expect from you and what you can expect from us.',
  sections: [
    {
      id: 'aceptacion',
      title: '1. Acceptance',
      blocks: [
        {
          type: 'p',
          text: 'These Terms govern the use of {{brandName}} (web app and mobile app), provided by {{legalName}}. By creating an account you accept these Terms and confirm you have read the Privacy Policy. If you do not agree, do not create an account or use the service.',
        },
      ],
    },
    {
      id: 'servicio',
      title: '2. What SanKen is',
      blocks: [
        { type: 'p', text: '{{brandName}} is a fitness training platform. Depending on your role and the available features, it lets you:' },
        {
          type: 'list',
          items: [
            'Complete a training profile and receive routines generated or assigned by a trainer or by the {{brandName}} team.',
            'Log workouts, sets, body measurements and meals, and see your progress.',
            'Join challenges, earn achievements and, if you turn it on, appear in rankings.',
            'Submit records with video for validation.',
            'Chat with your trainer (or with your clients, if you are a trainer).',
            'Order products from the store.',
          ],
        },
      ],
    },
    {
      id: 'cuenta',
      title: '3. Your account',
      blocks: [
        {
          type: 'list',
          items: [
            'You must provide truthful information and keep it up to date.',
            'Your account is personal. You are responsible for keeping your password confidential and for activity carried out with your credentials. We recommend enabling two-step verification.',
            'If you suspect unauthorized access, change your password and let us know at {{supportEmail}}.',
            'You must be at least {{minimumAge}} to sign up without an adult\'s authorization. If you are younger, you need authorization from your parent or legal guardian.',
          ],
        },
      ],
    },
    {
      id: 'uso-permitido',
      title: '4. Acceptable use',
      blocks: [
        { type: 'p', text: 'You may use {{brandName}} for your personal training and, if you are a verified trainer, to coach your clients. You may not:' },
        {
          type: 'list',
          items: [
            'Impersonate another person or create accounts with false data.',
            'Harass, threaten, insult or discriminate against other users, or send sexual, violent or illegal content.',
            'Submit fake or manipulated records or videos to alter rankings or challenges.',
            'Access or attempt to access other people\'s accounts or data, or bypass security measures.',
            'Use bots, scripts or any automated means to use the service or extract information.',
            'Interfere with the operation of the service or intentionally overload it.',
            'Use {{brandName}} for unauthorized commercial purposes or to send unsolicited advertising.',
          ],
        },
      ],
    },
    {
      id: 'contenido',
      title: '5. Content you post',
      blocks: [
        {
          type: 'p',
          text: 'You are responsible for the content you submit (profile photo, chat messages, record videos, notes and reports). You keep your rights over it and authorize us to store, process and display it only as needed to provide the service (for example, showing your photo to your trainer or letting the team review a record video).',
        },
        {
          type: 'p',
          text: 'You can report inappropriate content from the app. The {{brandName}} team may review, reject or remove content that breaches these Terms.',
        },
      ],
    },
    {
      id: 'entrenamiento',
      title: '6. Training, nutrition and health',
      blocks: [
        {
          type: 'note',
          text: '{{brandName}} is not a medical service. Routines, suggested loads, pre-workout adjustments and nutrition targets are for guidance only, are generated from the information you provide, and are not a diagnosis, treatment or professional medical or nutritional advice.',
        },
        {
          type: 'list',
          items: [
            'Before starting an exercise program or changing your diet, consult a health professional, especially if you have an injury or medical condition, are pregnant or have not trained before.',
            'Train within your limits, use proper technique and stop if you feel pain, dizziness or any abnormal symptom.',
            'You are responsible for deciding whether to perform each exercise and with what load.',
            'Trainers using {{brandName}} are responsible for the routines and recommendations they assign to their clients.',
          ],
        },
      ],
    },
    {
      id: 'tienda',
      title: '7. Store orders',
      blocks: [
        {
          type: 'p',
          text: 'Store orders are placed in the app and the {{brandName}} team contacts you to confirm them and arrange shipping and payment. The app does not process online payments. The order price is the one shown in the app when you confirm it; shipping cost, delivery times and exchange and return conditions are provided when the order is confirmed, under the consumer protection rules applicable in {{jurisdiction}}.',
        },
      ],
    },
    {
      id: 'disponibilidad',
      title: '8. Availability and changes to the service',
      blocks: [
        {
          type: 'p',
          text: 'We work to keep {{brandName}} available, but interruptions may occur due to maintenance, updates, technical failures or causes beyond our control. We may add, change or remove features. When a change significantly affects how you use the service, we will try to give you reasonable notice.',
        },
      ],
    },
    {
      id: 'propiedad',
      title: '9. Intellectual property',
      blocks: [
        {
          type: 'p',
          text: 'The {{brandName}} brand, its logos, the software, the interface design, texts, images, exercise videos, the exercise catalog and other graphic elements of the platform belong to {{legalName}} or its licensors and are protected by law. You may not copy, modify, distribute or use them outside the service without prior written authorization.',
        },
        {
          type: 'p',
          text: 'Food nutrition information comes partly from Open Food Facts, an open database, and is used under its license.',
        },
      ],
    },
    {
      id: 'suspension',
      title: '10. Suspension and account closure',
      blocks: [
        {
          type: 'p',
          text: 'We may suspend, deactivate or delete an account that breaches these Terms, where there are reasonable signs of fraud or of use that puts other users or the service at risk, or when required by an authority. Where possible, we will tell you why.',
        },
        {
          type: 'p',
          text: 'You can stop using {{brandName}} at any time and delete your account yourself from Settings > Delete my account (your account and data are permanently deleted), or request it by writing to {{privacyEmail}}.',
        },
      ],
    },
    {
      id: 'responsabilidad',
      title: '11. Liability',
      blocks: [
        {
          type: 'p',
          text: 'To the extent permitted by applicable law, {{brandName}} is not liable for injuries or damage resulting from performing exercises or following recommendations without due care, or for service interruptions beyond our control. Nothing in these Terms limits rights the law grants you that cannot be excluded.',
        },
      ],
    },
    {
      id: 'modificaciones',
      title: '12. Changes to these Terms',
      blocks: [
        {
          type: 'p',
          text: 'Each version of these Terms has a number and a date. If we change them materially, we will ask you to accept the new version before you keep using the app. Until you accept it you will not be able to use the app; if you disagree, you can delete your account from that same screen.',
        },
      ],
    },
    {
      id: 'ley',
      title: '13. Governing law',
      blocks: [{ type: 'p', text: 'These Terms are governed by the law of {{jurisdiction}}.' }],
    },
    {
      id: 'contacto',
      title: '14. Contact',
      blocks: [
        {
          type: 'p',
          text: 'For questions about these Terms write to {{supportEmail}}. For privacy matters, to {{privacyEmail}}.',
        },
      ],
    },
  ],
};

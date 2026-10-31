/** Field limits, shared by the form (counters) and the Worker (server/contactEmail.js checks the same numbers). */
export const contactLimits = { name: 100, email: 254, subject: 120, message: 2000, messageMin: 10 } as const

// Copy of the Contact section. No promised reply time: Jérémie did not commit to one.
export const contact = {
  title: { fr: 'Échangeons sur une opportunité.', en: 'Let’s talk about an opportunity.' },
  intro: {
    fr: 'Recruteur, RH ou porteur de projet : écrivez-moi ici, ou directement par email.',
    en: 'Recruiter, HR or project owner: write to me here, or directly by email.',
  },
  // Longer than profile.location, which stays short for the hero.
  location: { fr: 'Marseille · mobile dans toute la France', en: 'Marseille · open to relocation anywhere in France' },
  available: { fr: 'Disponible', en: 'Available' },
  cvPending: { fr: 'CV en cours de mise à jour' },
  copy: { fr: 'Copier l’adresse', en: 'Copy the address' },
  copied: { fr: 'Copiée', en: 'Copied' },
  name: { fr: 'Nom', en: 'Name' },
  namePlaceholder: { fr: 'Votre nom', en: 'Your name' },
  email: { fr: 'Email', en: 'Email' },
  emailPlaceholder: { fr: 'prenom.nom@entreprise.com', en: 'first.last@company.com' },
  subject: { fr: 'Sujet', en: 'Subject' },
  subjectPlaceholder: { fr: 'Opportunité, alternance, projet…', en: 'Opportunity, work-study, project…' },
  message: { fr: 'Message', en: 'Message' },
  messagePlaceholder: { fr: 'Décrivez votre besoin ou l’opportunité…', en: 'Describe your need or the opportunity…' },
  send: { fr: 'Envoyer', en: 'Send' },
  sending: { fr: 'Envoi…', en: 'Sending…' },
  successTitle: { fr: 'Message reçu.', en: 'Message received.' },
  successBody: { fr: 'Merci, je vous réponds par email dès que possible.', en: 'Thank you, I will reply by email as soon as I can.' },
  another: { fr: 'Envoyer un autre message', en: 'Send another message' },
  error: { fr: 'Le message n’a pas pu partir.', en: 'The message could not be sent.' },
  fallback: { fr: 'Écrire directement par email', en: 'Write directly by email' },
}

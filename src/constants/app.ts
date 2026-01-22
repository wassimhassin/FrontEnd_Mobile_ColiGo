export const APP_NAME = 'ColiGo';
export const APP_TAGLINE = 'Transport de colis en toute confiance';

export const USER_ROLES = {
  CLIENT: 'client',
  TRANSPORTER: 'transporter',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  TERMS_ACCEPTED: 'terms_accepted',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
  },
  USER: {
    PROFILE: '/user/profile',
    KYC: '/user/kyc',
  },
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  PASSWORD_MIN_LENGTH: 8,
};

export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Envoyez vos colis partout',
    description: 'Connectez-vous avec des transporteurs de confiance pour envoyer vos colis à l\'international.',
    image: 'package',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Transporteurs vérifiés',
    description: 'Tous nos transporteurs passent par une vérification d\'identité stricte pour votre sécurité.',
    image: 'shield',
    color: '#22c55e',
  },
  {
    id: '3',
    title: 'Paiement sécurisé',
    description: 'Payez en toute sécurité. Le transporteur reçoit son paiement après livraison.',
    image: 'wallet',
    color: '#f97316',
  },
  {
    id: '4',
    title: 'Suivi en temps réel',
    description: 'Suivez votre colis à chaque étape, de la collecte à la livraison.',
    image: 'tracking',
    color: '#8b5cf6',
  },
];

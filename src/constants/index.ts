export * from "./theme";
export * from "./app";

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+33|0)[1-9](\d{2}){4}$/,
  PASSWORD_MIN_LENGTH: 8,
};

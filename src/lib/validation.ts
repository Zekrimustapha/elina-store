import { wilayas, getCommunesByWilaya } from './algeria-data';

/**
 * Normalizes Algerian phone numbers to the canonical 10-digit format: 05XXXXXXXX, 06XXXXXXXX, or 07XXXXXXXX.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+213')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('00213')) {
    cleaned = '0' + cleaned.slice(5);
  } else if (cleaned.startsWith('213') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.length === 9 && /^[567]/.test(cleaned)) {
    cleaned = '0' + cleaned;
  }

  cleaned = cleaned.replace(/\D/g, '');
  return cleaned;
}

export function validatePhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^0[567]\d{8}$/.test(normalized);
}

export function validateFullName(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 3 && trimmed.length <= 100;
}

export function validateAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return trimmed.length >= 3 && trimmed.length <= 300;
}

/**
 * Validates that the wilaya string exists in our 58 wilayas list.
 */
export function validateWilaya(wilayaString: string): boolean {
  if (!wilayaString) return false;
  return wilayas.includes(wilayaString);
}

/**
 * Validates that the commune belongs to the selected wilaya string.
 */
export function validateCommune(wilayaString: string, communeName: string): boolean {
  if (!wilayaString || !communeName) return false;
  const validCommunes = getCommunesByWilaya(wilayaString);
  const trimmedCommune = communeName.trim();

  return validCommunes.includes(trimmedCommune);
}

export function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
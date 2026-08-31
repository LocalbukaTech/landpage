/**
 * Utility to retrieve or generate a persistent device identifier.
 * Used for referral fraud detection and device-fingerprinting.
 */

const DEVICE_ID_KEY = 'localbuka_device_id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    return 'server-generated-device-id';
  }

  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }

    let newId: string;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      newId = crypto.randomUUID();
    } else {
      // Fallback RFC4122 v4 UUID generator
      newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    localStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch (error) {
    console.error('Error generating or retrieving device ID:', error);
    return 'fallback-device-id-' + Math.random().toString(36).substring(2, 15);
  }
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/** Parse a time string like "9:00", "09:00", "9:00 AM", "9:00 PM" → minutes since midnight */
function parseTime(timeStr: string): number | null {
  const normalized = timeStr.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):?(\d{2})\s*(AM|PM)?$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Returns true if the restaurant is currently open based on its openingHours object.
 * openingHours format: { "Monday": "9:00-18:00", "Tuesday": "9:00 AM - 9:00 PM", ... }
 */
export function isRestaurantOpen(
  openingHours: Record<string, string> | null | undefined,
): boolean {
  if (!openingHours) return false;

  const now = new Date();
  const dayName = DAYS[now.getDay()];

  // Look up today, case-insensitively
  const todayKey = Object.keys(openingHours).find(
    (k) => k.toLowerCase() === dayName.toLowerCase(),
  );
  if (!todayKey) return false;

  const todayHours = openingHours[todayKey].trim();
  const lower = todayHours.toLowerCase();

  if (lower === 'closed' || lower === 'close' || lower === '') return false;
  if (lower.includes('24 hours') || lower.includes('open 24')) return true;

  // Split on em-dash or hyphen, allowing optional surrounding spaces
  const parts = todayHours.split(/\s*[–-]\s*/);
  if (parts.length < 2) return false;

  const openMins = parseTime(parts[0]);
  const closeMins = parseTime(parts[parts.length - 1]);

  if (openMins === null || closeMins === null) return false;

  const currentMins = now.getHours() * 60 + now.getMinutes();

  // Handle overnight ranges (e.g. 22:00-02:00)
  if (closeMins < openMins) {
    return currentMins >= openMins || currentMins < closeMins;
  }

  return currentMins >= openMins && currentMins < closeMins;
}

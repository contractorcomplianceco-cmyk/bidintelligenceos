/** Extract US state code from "City, ST" or trailing state abbreviation. */
export function parseStateFromLocation(location: string): string | null {
  const trimmed = location.trim();
  if (!trimmed) return null;
  const comma = trimmed.match(/,\s*([A-Z]{2})\b/i);
  if (comma) return comma[1].toUpperCase();
  const tail = trimmed.match(/\b([A-Z]{2})\b\s*$/i);
  if (tail) return tail[1].toUpperCase();
  return null;
}

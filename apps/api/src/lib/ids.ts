export function nextId(prefix: string): string {
  const n = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return `${prefix}-${n}`.toUpperCase();
}

export function nowIso(): string {
  return new Date().toISOString();
}

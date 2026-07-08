let tokenGetter: (() => Promise<string | null>) | null = null;

export function setApiAuthTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

export function clearApiAuthTokenGetter() {
  tokenGetter = null;
}

export async function getApiAuthHeaders(): Promise<Record<string, string>> {
  if (!tokenGetter) return {};
  const token = await tokenGetter();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://manajemen-operasional-klinik-gigi-production.up.railway.app";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/** Decode JWT payload tanpa library (base64url decode) */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Ambil role dari JWT yang tersimpan di localStorage */
export function getRoleFromToken(): string | null {
  const token = getToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return (payload?.role as string) ?? null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Simpan token ke localStorage DAN role ke cookie agar middleware bisa baca */
export function setToken(token: string) {
  localStorage.setItem("access_token", token);

  // Decode role dari JWT dan simpan ke cookie (maxAge 8 jam sesuai backend)
  const payload = decodeJwtPayload(token);
  const role = (payload?.role as string) ?? "";
  document.cookie = `user_role=${role}; path=/; max-age=${8 * 60 * 60}; SameSite=Lax`;
}

/** Hapus token dari localStorage dan hapus cookie role */
export function clearToken() {
  localStorage.removeItem("access_token");
  document.cookie = "user_role=; path=/; max-age=0";
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export interface StoredCredentials {
  username: string;
  passwordHash: string;
}

const CREDENTIALS_COOKIE = "virada_credentials";
const SESSION_COOKIE = "virada_session";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getStoredCredentials(): StoredCredentials | null {
  const raw = getCookie(CREDENTIALS_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as StoredCredentials;
  } catch {
    return null;
  }
}

export function saveCredentials(credentials: StoredCredentials): void {
  setCookie(CREDENTIALS_COOKIE, btoa(JSON.stringify(credentials)));
}

export function isLoggedIn(): boolean {
  return getCookie(SESSION_COOKIE) === "1";
}

export function setSession(): void {
  setCookie(SESSION_COOKIE, "1", 1);
}

export function clearSession(): void {
  deleteCookie(SESSION_COOKIE);
}

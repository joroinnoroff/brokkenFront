export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CART_COOKIE_NAME = "cartUserId";
export const CART_UPDATED_EVENT = "cartUpdated";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const cookies = document.cookie.split("; ").filter(Boolean);
  const existing = cookies.find((c) => c.startsWith(`${name}=`));
  return existing ? existing.split("=")[1] : "";
}

export function getCartUserId(): string {
  const existing = getCookie(CART_COOKIE_NAME);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const oneYearInSeconds = 60 * 60 * 24 * 365;
  document.cookie = `${CART_COOKIE_NAME}=${id}; path=/; max-age=${oneYearInSeconds}`;
  return id;
}

function getStorageKey(): string {
  const userId = getCartUserId();
  return userId ? `cart_${userId}` : "";
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const key = getStorageKey();
  if (!key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  const key = getStorageKey();
  if (!key) return;
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function getCartCount(): number {
  return getCart().length;
}

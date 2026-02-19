import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(url: string, base?: string): string {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const apiBase = base ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  if (!apiBase) return url;
  return `${String(apiBase).replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Flatten nested image arrays from backend (e.g. [[["url1","url2"]]]) into string[] */
export function flattenImageUrls(img: unknown): string[] {
  if (typeof img === "string") return [img];
  if (Array.isArray(img)) return img.flatMap(flattenImageUrls);
  return [];
}

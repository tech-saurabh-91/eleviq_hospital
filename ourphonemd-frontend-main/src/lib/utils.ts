import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskContactInfo(method: 'email' | 'phone', value: string): string {
  if (method === 'email' && value) {
    const [user, domain] = value.split('@');
    return `${user.charAt(0)}***${user.slice(-1)}@${domain}`;
  }
  if (method === 'phone' && value) {
    return `***-***-${value.slice(-4)}`;
  }
  return '';
}

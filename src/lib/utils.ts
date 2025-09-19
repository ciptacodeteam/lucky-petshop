import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNameInitial(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function getTwoWordName(fullname: string): string {
  if (!fullname) return "";
  const words = fullname.trim().split(/\s+/);
  if (words.length === 1) return words[0] || "";
  return `${words[0]} ${words[1]}`;
}

export function whatsappMessageFormatter(message: string) {
  return encodeURIComponent(message);
}

export function sendWhatsappMessage(phoneNumber: string, message: string) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessageFormatter(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

export function getWhatsappMessageUrl(phoneNumber: string, message: string) {
  return `https://wa.me/${phoneNumber}?text=${whatsappMessageFormatter(message)}`;
}

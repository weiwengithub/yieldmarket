import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDayNumber(time: number) {
  return time > 86400 ? `${time / 86400} days` : `${time / 3600} hours`;
}
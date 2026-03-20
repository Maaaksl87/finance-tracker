import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const glassStyle = cn(
  "relative bg-card text-card-foreground flex flex-col rounded-xl border border-amber-50 py-3 inset-shadow-sm inset-shadow-white/50",
);

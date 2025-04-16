import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with Tailwind
 * Combines multiple class values into one using clsx and handles
 * Tailwind class conflicts with tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 
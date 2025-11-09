import { clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const dateShowFormat = (date) => {
  // date with time 17oct 2025 10:00:00
  return moment(date).format('DD MMM YYYY HH:mm:ss');
}

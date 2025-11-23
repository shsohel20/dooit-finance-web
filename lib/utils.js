import { clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const dateShowFormat = (date) => {

  return moment(date).format('DD MMM YYYY');
}

export const dateShowFormatWithTime = (date) => {
  // date with time 17oct 2025 10:00 AM
  return moment(date).format('DD MMM YYYY hh:mm A');
}

export const objWithValidValues = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined && value !== '' && value !== null));
}

export const getQueryString = (obj) => {
  return new URLSearchParams(obj).toString();
}

export const formatAUD = (amount, currency = 'AUD') => {
  const formattedAmount = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${formattedAmount}`;
}

export const formatDateTime = (timestamp) => {
  const m = moment(timestamp);

  return {
    date: m.format("DD MMM YYYY"),     // e.g., "23 Nov 2025"
    time: m.format("hh:mm A"),         // e.g., "11:15 AM"
  };
}

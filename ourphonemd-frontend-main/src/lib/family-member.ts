const FAMILY_DATE_PATTERN = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

/**
 * Keeps the family-member date format unambiguous in both forms and API
 * payloads: DD/MM/YYYY.
 */
export const formatFamilyDateInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const isValidPastFamilyDate = (value: string) => {
  if (!FAMILY_DATE_PATTERN.test(value)) return false;

  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  const todayAtMidnight = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= todayAtMidnight
  );
};

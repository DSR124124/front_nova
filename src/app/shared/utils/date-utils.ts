// Utilidades de fecha para Angular
export function toIsoString(date: Date): string {
  return date.toISOString();
}

export function fromIsoString(iso: string): Date {
  return new Date(iso);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

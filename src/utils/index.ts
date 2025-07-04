import { parseDate } from "chrono-node";

export function convertToTimeZone(dateTime: string, timeZone: string): string {
  return new Date(
    new Date(dateTime).toLocaleString('en-US', {
      timeZone: timeZone
    })
  ).toISOString();
}

export function parseNaturalDate(input: string, refDate = new Date()): string | null {
  const result = parseDate(input, refDate);
  return result ? result.toISOString() : null;
}

export function convertToTimeZone(dateTime: string, timeZone: string): string {
  return new Date(
    new Date(dateTime).toLocaleString('en-US', {
      timeZone: timeZone
    })
  ).toISOString();
}
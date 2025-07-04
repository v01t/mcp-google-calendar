import { google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";
import { convertToTimeZone } from "../utils/index.js";
import { CALENDAR_ID, DEFAULT_TIME_ZONE } from "./constants.js";

interface UpdateEventParams {
  summary?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  attendees?: string[];
}

export async function updateEvent(
  eventId: string,
  updates: UpdateEventParams
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    const existing = await calendar.events.get({ calendarId: CALENDAR_ID, eventId });

    const updated = {
      ...existing.data,
      summary: updates.summary ?? existing.data.summary,
      description: updates.description ?? existing.data.description,
      start: updates.startTime
        ? {
            dateTime: convertToTimeZone(updates.startTime, DEFAULT_TIME_ZONE),
            timeZone: DEFAULT_TIME_ZONE,
          }
        : existing.data.start,
      end: updates.endTime
        ? {
            dateTime: convertToTimeZone(updates.endTime, DEFAULT_TIME_ZONE),
            timeZone: DEFAULT_TIME_ZONE,
          }
        : existing.data.end,
      attendees: updates.attendees ? updates.attendees.map((email) => ({ email })) : existing.data.attendees,
    };

    const result = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId,
      requestBody: updated,
      sendUpdates: "all",
    });

    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error while updating event" };
  }
}

import { calendar_v3, google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";
import { DEFAULT_TIME_ZONE, CALENDAR_ID } from "./constants.js";

interface CreateEventParams {
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
}

export async function createEvent(
  params: CreateEventParams
): Promise<{ success: true; data: calendar_v3.Schema$Event } | { success: false; error: string }> {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    const event: calendar_v3.Schema$Event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime,
        timeZone: DEFAULT_TIME_ZONE,
      },
      end: {
        dateTime: params.endTime,
        timeZone: DEFAULT_TIME_ZONE,
      },
      attendees: params.attendees?.map((email) => ({ email })),
    };

    const result = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
      sendUpdates: "all",
    });

    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error while creating event" };
  }
}

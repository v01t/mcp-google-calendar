import { calendar_v3, google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";

interface CreateEventParams {
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
}

interface CreateEventResult {
  success: boolean;
  error?: string;
  data?: calendar_v3.Schema$Event;
}

export async function createEvent(params: CreateEventParams): Promise<CreateEventResult> {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime,
        timeZone: process.env.GOOGLE_TIME_ZONE || "Etc/UTC",
      },
      end: {
        dateTime: params.endTime,
        timeZone: process.env.GOOGLE_TIME_ZONE || "Etc/UTC",
      },
      attendees: params.attendees?.map((email) => ({ email })),
    };

    const result = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: event,
      sendUpdates: "all",
    });

    return {
      success: true,
      data: result.data || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating event",
    };
  }
}

import { calendar_v3, google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";
import { convertToTimeZone } from "../utils/index.js";

interface ListEventsParams {
  timeMin: string;
  maxResults: number;
}

interface ListEventsResult {
  success: boolean;
  error?: string;
  data?: calendar_v3.Schema$Event[];
}

export async function listEvents(params: ListEventsParams): Promise<ListEventsResult> {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    const result = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      timeMin: convertToTimeZone(params.timeMin, process.env.GOOGLE_TIME_ZONE || "Asia/Taipei"),
      maxResults: params.maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    return {
      success: true,
      data: result.data?.items || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error getting event list",
    };
  }
}

import { calendar_v3, google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";
import { convertToTimeZone } from "../utils/index.js";
import { CALENDAR_ID, DEFAULT_TIME_ZONE } from "./constants.js";

interface ListEventsParams {
  timeMin: string;
  maxResults: number;
}

export async function listEvents(
  params: ListEventsParams
): Promise<{ success: boolean; data?: calendar_v3.Schema$Event[]; error?: string }> {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    const result = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: convertToTimeZone(params.timeMin, DEFAULT_TIME_ZONE),
      maxResults: params.maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    return { success: true, data: result.data?.items || [] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error while listing events" };
  }
}

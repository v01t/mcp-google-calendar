import { google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";
import { CALENDAR_ID } from "./constants.js";

export async function deleteEvent(eventId: string): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId,
      sendUpdates: "all",
    });

    return { success: true, data: "Event successfully deleted" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error while deleting event" };
  }
}

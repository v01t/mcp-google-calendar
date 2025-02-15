import { google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";

export async function deleteEvent(eventId: string) {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      eventId: eventId,
      sendUpdates: "all",
    });

    return {
      success: true,
      data: "Event successfully deleted",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error deleting event",
    };
  }
}

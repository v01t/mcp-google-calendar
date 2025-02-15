import { google } from "googleapis";
import { getAuthClient } from "../utils/auth.js";
import { convertToTimeZone } from "../utils/index.js";

interface UpdateEventParams {
  summary?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  attendees?: string[];
}

export async function updateEvent(eventId: string, updates: UpdateEventParams) {
  try {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    // 先取得現有活動資料
    const event = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      eventId: eventId,
    });

    // 準備更新的資料
    const updatedEvent = {
      ...event.data,
      summary: updates.summary || event.data.summary,
      description: updates.description || event.data.description,
      start: updates.startTime
        ? {
            dateTime: convertToTimeZone(updates.startTime, process.env.GOOGLE_TIME_ZONE || "Asia/Taipei"),
            timeZone: process.env.GOOGLE_TIME_ZONE || "Asia/Taipei",
          }
        : event.data.start,
      end: updates.endTime
        ? {
            dateTime: convertToTimeZone(updates.endTime, process.env.GOOGLE_TIME_ZONE || "Asia/Taipei"),
            timeZone: process.env.GOOGLE_TIME_ZONE || "Asia/Taipei",
          }
        : event.data.end,
      attendees: updates.attendees ? updates.attendees.map((email) => ({ email })) : event.data.attendees,
    };

    const result = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      eventId: eventId,
      requestBody: updatedEvent,
      sendUpdates: "all",
    });

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error updating event",
    };
  }
}

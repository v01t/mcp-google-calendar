export const CREATE_EVENT_TOOL = {
  name: "create_event",
  description: "Create a new Google Calendar event",
  inputSchema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "Event title",
      },
      description: {
        type: "string",
        description: "Event description",
      },
      startTime: {
        type: "string",
        format: "date-time",
        description: "Event start time (ISO 8601 format, e.g. 2025-07-04T09:00:00+02:00)",
      },
      endTime: {
        type: "string",
        format: "date-time",
        description: "Event end time (ISO 8601 format, e.g. 2025-07-04T10:00:00+02:00)",
      },
      attendees: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of attendee email addresses",
      },
    },
    required: ["summary", "startTime", "endTime"],
  },
};

export const LIST_EVENTS_TOOL = {
  name: "list_events",
  description: "List Google Calendar events",
  inputSchema: {
    type: "object",
    properties: {
      timeMin: {
        type: "string",
        format: "date-time",
        description: "Start time (ISO 8601 format)",
      },
      maxResults: {
        type: "number",
        description: "Maximum number of results to return",
      },
    },
  },
};

export const UPDATE_EVENT_TOOL = {
  name: "update_event",
  description: "Update an existing Google Calendar event",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID of the event to update",
      },
      updates: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "New event title",
          },
          description: {
            type: "string",
            description: "New event description",
          },
          startTime: {
            type: "string",
            format: "date-time",
            description: "New start time (ISO 8601 format)",
          },
          endTime: {
            type: "string",
            format: "date-time",
            description: "New end time (ISO 8601 format)",
          },
          attendees: {
            type: "array",
            items: {
              type: "string",
            },
            description: "New list of attendees",
          },
        },
      },
    },
    required: ["eventId", "updates"],
  },
};

export const DELETE_EVENT_TOOL = {
  name: "delete_event",
  description: "Delete a Google Calendar event",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID of the event to delete",
      },
    },
    required: ["eventId"],
  },
};

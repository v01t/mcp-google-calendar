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
        description: "Event start time (ISO format)",
      },
      endTime: {
        type: "string",
        description: "Event end time (ISO format)",
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
        description: "Start time (ISO format)",
      },
      maxResults: {
        type: "number",
        description: "Maximum number of results",
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
            description: "New start time",
          },
          endTime: {
            type: "string",
            description: "New end time",
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

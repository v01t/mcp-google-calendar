#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { calendar_v3 } from "googleapis";

import { createEvent, deleteEvent, listEvents, tools, updateEvent } from "./calendar-tools/_index.js";
import { getAuthClient } from "./utils/auth.js";

const server = new Server(
  {
    name: "mcp-server/calendar_executor",
    version: "0.0.1",
  },
  {
    capabilities: {
      description: "An MCP server providing Google Calendar integration!",
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No parameters provided");
    }

    if (name === "create_event") {
      const { summary, description, startTime, endTime, attendees } = args as {
        summary: string;
        description: string;
        startTime: string;
        endTime: string;
        attendees?: string[];
      };

      const result = await createEvent({
        summary,
        description,
        startTime,
        endTime,
        attendees,
      });

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text", text: `Successfully created event: ${result.data?.summary || ""}` }],
        isError: false,
      };
    }

    if (name === "list_events") {
      const { timeMin, maxResults } = args as {
        timeMin?: string;
        maxResults?: number;
      };

      const result = await listEvents({
        timeMin: timeMin || new Date().toISOString(),
        maxResults: maxResults || 10,
      });

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text", text: formatEventsList(result.data || []) }],
        isError: false,
      };
    }

    if (name === "update_event") {
      const { eventId, updates } = args as {
        eventId: string;
        updates: {
          summary?: string;
          description?: string;
          startTime?: string;
          endTime?: string;
          attendees?: string[];
        };
      };

      const result = await updateEvent(eventId, updates);

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text", text: `Successfully updated event: ${result.data?.summary || ""}` }],
        isError: false,
      };
    }

    if (name === "delete_event") {
      const { eventId } = args as {
        eventId: string;
      };

      const result = await deleteEvent(eventId);

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text", text: "Successfully deleted event" }],
        isError: false,
      };
    }

    return {
      content: [{ type: "text", text: `Error: ${name} is an unknown tool` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  try {
    // 先初始化認證
    await getAuthClient();

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Calendar Server started");
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

runServer().catch((error) => {
  console.error("Server encountered a critical error:", error);
  process.exit(1);
});

function formatEventsList(events: calendar_v3.Schema$Event[]): string {
  return events
    .map((event) => {
      return `
      ID
Event: ${event.summary}
Description: ${event.description || "None"}
Start Time: ${new Date(event.start?.dateTime || "").toLocaleString()}
End Time: ${new Date(event.end?.dateTime || "").toLocaleString()}
Attendees: ${event.attendees?.map((a: calendar_v3.Schema$EventAttendee) => a.email).join(", ") || "None"}
    `.trim();
    })
    .join("\n\n");
}

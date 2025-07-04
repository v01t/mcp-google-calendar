import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEvent } from "../createEvent.js";
import { google } from "googleapis";

// Mock auth
vi.mock("../../utils/auth.js", () => ({
  getAuthClient: vi.fn().mockResolvedValue("mocked-auth"),
}));

// Mock googleapis
vi.mock("googleapis", async () => {
  const actual = await vi.importActual<any>("googleapis");
  return {
    ...actual,
    google: {
      calendar: vi.fn(() => ({
        events: {
          insert: vi.fn().mockResolvedValue({
            data: { id: "123", summary: "Test Event" },
          }),
        },
      })),
    },
  };
});

describe("createEvent", () => {
  it("should create an event and return success", async () => {
    const result = await createEvent({
      summary: "Test Event",
      startTime: "2025-07-05T10:00:00",
      endTime: "2025-07-05T11:00:00",
      attendees: ["test@example.com"],
    });

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ id: "123", summary: "Test Event" });
  });
});

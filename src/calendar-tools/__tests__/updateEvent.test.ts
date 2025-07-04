import { updateEvent } from "../updateEvent.js";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../utils/auth.js", () => ({
  getAuthClient: vi.fn().mockResolvedValue("mocked-auth"),
}));

vi.mock("../../utils/index.js", () => ({
  convertToTimeZone: (time: string) => time,
}));

vi.mock("googleapis", async () => {
  const actual = await vi.importActual<any>("googleapis");
  return {
    ...actual,
    google: {
      calendar: vi.fn(() => ({
        events: {
          get: vi.fn().mockResolvedValue({
            data: {
              id: "123",
              summary: "Old Event",
              start: { dateTime: "2025-07-01T10:00:00" },
              end: { dateTime: "2025-07-01T11:00:00" },
              attendees: [],
            },
          }),
          update: vi.fn().mockResolvedValue({
            data: { id: "123", summary: "Updated Event" },
          }),
        },
      })),
    },
  };
});

describe("updateEvent", () => {
  it("should update an event and return success", async () => {
    const result = await updateEvent("123", {
      summary: "Updated Event",
      startTime: "2025-07-05T12:00:00",
      endTime: "2025-07-05T13:00:00",
    });

    expect(result.success).toBe(true);
    expect(result.data?.summary).toBe("Updated Event");
  });
});

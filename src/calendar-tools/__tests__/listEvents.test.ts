import { listEvents } from "../listEvents.js";
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
          list: vi.fn().mockResolvedValue({
            data: {
              items: [{ id: "event1", summary: "Listed Event" }],
            },
          }),
        },
      })),
    },
  };
});

describe("listEvents", () => {
  it("should return a list of events", async () => {
    const result = await listEvents({ timeMin: "2025-07-01T00:00:00", maxResults: 5 });

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].summary).toBe("Listed Event");
  });
});

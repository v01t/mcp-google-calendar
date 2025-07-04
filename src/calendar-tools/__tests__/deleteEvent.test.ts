import { deleteEvent } from "../deleteEvent.js";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../utils/auth.js", () => ({
  getAuthClient: vi.fn().mockResolvedValue("mocked-auth"),
}));

vi.mock("googleapis", async () => {
  const actual = await vi.importActual<any>("googleapis");
  return {
    ...actual,
    google: {
      calendar: vi.fn(() => ({
        events: {
          delete: vi.fn().mockResolvedValue(undefined),
        },
      })),
    },
  };
});

describe("deleteEvent", () => {
  it("should delete an event successfully", async () => {
    const result = await deleteEvent("123");
    expect(result.success).toBe(true);
    expect(result.data).toBe("Event successfully deleted");
  });
});

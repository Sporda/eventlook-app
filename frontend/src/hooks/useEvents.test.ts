import { renderHook, waitFor } from "@testing-library/react";
import { useEvents } from "./useEvents";

// Mock fetch
global.fetch = jest.fn();

describe("useEvents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch events successfully", async () => {
    const mockEvents = [
      {
        id: 1,
        name: "Test Event",
        place: "Test Place",
        startDate: "2024-12-31",
        ticketCount: 100,
        ticketPrice: 299,
        tickets: [],
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockEvents),
    });

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe("Network error");
  });

  it("should handle HTTP error response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe("HTTP error! status: 500");
  });
});

import { renderHook, act } from "@testing-library/react";
import { useTicketPurchase } from "./useTicketPurchase";

// Mock fetch
global.fetch = jest.fn();

describe("useTicketPurchase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should purchase tickets successfully", async () => {
    const mockResponse = {
      order: {
        id: 1,
        orderNumber: "ORD-123456789-001",
        createdAt: "2024-01-01T00:00:00Z",
      },
      tickets: [
        {
          id: 1,
          ticketNumber: "TKT-123456789-0001",
          event: {
            id: 1,
            name: "Test Event",
            place: "Test Place",
            startDate: "2024-12-31",
            ticketPrice: 299,
          },
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const { result } = renderHook(() => useTicketPurchase());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.purchaseTickets({
        eventId: 1,
        quantity: 1,
      });
    });

    expect(success).toBe(true);
    expect(result.current.purchasedTickets).toEqual(mockResponse.tickets);
    expect(result.current.error).toBeNull();
  });

  it("should handle purchase error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({ message: "Not enough tickets" }),
    });

    const { result } = renderHook(() => useTicketPurchase());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.purchaseTickets({
        eventId: 1,
        quantity: 10,
      });
    });

    expect(success).toBe(false);
    expect(result.current.purchasedTickets).toEqual([]);
    expect(result.current.error).toBe("Not enough tickets");
  });

  it("should clear tickets", () => {
    const { result } = renderHook(() => useTicketPurchase());

    act(() => {
      result.current.clearTickets();
    });

    expect(result.current.purchasedTickets).toEqual([]);
  });
});

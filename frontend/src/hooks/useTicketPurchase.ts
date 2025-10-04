import { useState } from "react";
import { Ticket } from "../types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface PurchaseTicketsRequest {
  eventId: number;
  quantity: number;
}

interface PurchaseTicketsResponse {
  order: {
    id: number;
    orderNumber: string;
    createdAt: string;
  };
  tickets: Ticket[];
}

export const useTicketPurchase = () => {
  const [purchasedTickets, setPurchasedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseTickets = async (
    request: PurchaseTicketsRequest
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/tickets/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: PurchaseTicketsResponse = await response.json();
      setPurchasedTickets((prev) => [...prev, ...data.tickets]);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Purchase failed";
      setError(errorMessage);
      console.error("Error purchasing tickets:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearTickets = () => {
    setPurchasedTickets([]);
  };

  return {
    purchasedTickets,
    loading,
    error,
    purchaseTickets,
    clearTickets,
  };
};

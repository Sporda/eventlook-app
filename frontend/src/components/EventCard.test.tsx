import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventCard } from "./EventCard";
import { Event } from "../types";

const mockEvent: Event = {
  id: 1,
  name: "Test Event",
  place: "Test Place",
  startDate: "2024-12-31",
  ticketCount: 100,
  ticketPrice: 299,
  tickets: [],
};

const mockOnPurchase = jest.fn();

describe("EventCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render event information", () => {
    render(
      <EventCard
        event={mockEvent}
        onPurchase={mockOnPurchase}
        isSoldOut={false}
      />
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("📍 Test Place")).toBeInTheDocument();
    expect(screen.getByText("299 Kč")).toBeInTheDocument();
    expect(screen.getByText("0 / 100 prodáno")).toBeInTheDocument();
  });

  it("should call onPurchase when buy button is clicked", () => {
    render(
      <EventCard
        event={mockEvent}
        onPurchase={mockOnPurchase}
        isSoldOut={false}
      />
    );

    const buyButton = screen.getByText("Koupit lístky");
    fireEvent.click(buyButton);

    expect(mockOnPurchase).toHaveBeenCalledWith(mockEvent);
  });

  it("should show sold out state when isSoldOut is true", () => {
    render(
      <EventCard
        event={mockEvent}
        onPurchase={mockOnPurchase}
        isSoldOut={true}
      />
    );

    expect(screen.getByText("Vyprodáno")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Vyprodáno" });
    expect(button).toBeDisabled();
  });

  it("should show correct available tickets count", () => {
    const eventWithTickets = {
      ...mockEvent,
      tickets: new Array(25).fill({}), // 25 tickets sold
    };

    render(
      <EventCard
        event={eventWithTickets}
        onPurchase={mockOnPurchase}
        isSoldOut={false}
      />
    );

    expect(screen.getByText("25 / 100 prodáno")).toBeInTheDocument();
    expect(screen.getByText("75 dostupných")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the hooks
jest.mock("./hooks/useEvents", () => ({
  useEvents: () => ({
    events: [],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock("./hooks/useTicketPurchase", () => ({
  useTicketPurchase: () => ({
    purchasedTickets: [],
    loading: false,
    error: null,
    purchaseTickets: jest.fn(),
    clearTickets: jest.fn(),
  }),
}));

test("renders Eventlook title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Eventlook/i);
  expect(titleElement).toBeInTheDocument();
});

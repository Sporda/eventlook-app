import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";
import { Event } from "../types";
import { logger } from "../utils/logger";

interface EventCardProps {
  event: Event;
  onPurchase: (event: Event) => void;
  isSoldOut: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPurchase,
  isSoldOut,
}) => {
  const availableTickets = event.ticketCount - (event.tickets?.length || 0);
  const soldPercentage =
    ((event.tickets?.length || 0) / event.ticketCount) * 100;

  return (
    <Card
      className="event-card"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        className="card-image"
        sx={{
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "4rem",
          color: "rgba(255, 255, 255, 0.8)",
        }}
      >
        🎫
      </Box>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h5" className="event-title" sx={{ mb: 2 }}>
          {event.name}
        </Typography>

        <Typography variant="body2" className="event-location" sx={{ mb: 1 }}>
          📍 {event.place}
        </Typography>

        <Typography variant="body2" className="event-date" sx={{ mb: 2 }}>
          📅{" "}
          {new Date(event.startDate).toLocaleDateString("cs-CZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>

        <Typography
          variant="h4"
          className="event-price"
          sx={{ mb: 2, color: "primary.main" }}
        >
          {event.ticketPrice.toLocaleString("cs-CZ")} Kč
        </Typography>

        <Box
          className="ticket-info"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          <Typography variant="body2" className="sold-count">
            {event.tickets?.length || 0} / {event.ticketCount} prodáno
          </Typography>
          <Chip
            label={`${availableTickets} dostupných`}
            className={`availability-chip ${
              availableTickets > 10
                ? "high"
                : availableTickets > 0
                ? "medium"
                : "low"
            }`}
            size="small"
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={soldPercentage}
          className={`progress-bar ${
            soldPercentage > 80
              ? "low"
              : soldPercentage > 50
              ? "medium"
              : "high"
          }`}
          sx={{ mb: 3, height: 8, borderRadius: 1 }}
        />

        <Button
          variant="contained"
          className="purchase-button"
          onClick={() => {
            logger.info(
              `User clicked purchase button for event: ${event.name}`,
              "EventCard"
            );
            onPurchase(event);
          }}
          disabled={isSoldOut}
          sx={{ mt: "auto" }}
        >
          {isSoldOut ? "Vyprodáno" : "Koupit lístky"}
        </Button>
      </CardContent>
    </Card>
  );
};

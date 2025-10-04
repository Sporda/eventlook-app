import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
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
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {event.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          📍 {event.place}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          📅{" "}
          {new Date(event.startDate).toLocaleDateString("cs-CZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {event.ticketPrice.toLocaleString("cs-CZ")} Kč
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {event.tickets?.length || 0} / {event.ticketCount} prodáno
            </Typography>
            <Chip
              label={`${availableTickets} dostupných`}
              color={
                availableTickets > 10
                  ? "success"
                  : availableTickets > 0
                  ? "warning"
                  : "error"
              }
              size="small"
            />
          </Box>

          <Box
            sx={{ width: "100%", bgcolor: "grey.200", borderRadius: 1, mb: 2 }}
          >
            <Box
              sx={{
                width: `${soldPercentage}%`,
                height: 8,
                bgcolor:
                  soldPercentage > 80
                    ? "error.main"
                    : soldPercentage > 50
                    ? "warning.main"
                    : "success.main",
                borderRadius: 1,
                transition: "width 0.3s ease",
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
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
        </Box>
      </CardContent>
    </Card>
  );
};

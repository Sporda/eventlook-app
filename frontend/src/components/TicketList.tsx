import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { Ticket } from "../types";

interface TicketListProps {
  tickets: Ticket[];
  onClear: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onClear }) => {
  if (tickets.length === 0) return null;

  const totalValue = tickets.reduce(
    (sum, ticket) => sum + ticket.event.ticketPrice,
    0
  );

  return (
    <Container className="ticket-list" maxWidth="md" sx={{ mt: 5 }}>
      <Box
        className="ticket-list-header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          className="ticket-list-title"
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          Vaše lístky ({tickets.length})
        </Typography>
        <Button
          variant="outlined"
          className="clear-button"
          onClick={onClear}
          sx={{ color: "grey.300", borderColor: "grey.600" }}
        >
          Vymazat všechny
        </Button>
      </Box>

      <Paper
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: "grey.800",
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Celková hodnota: {totalValue.toLocaleString("cs-CZ")} Kč
      </Paper>

      {tickets.map((ticket, index) => (
        <Card
          key={`${ticket.id}-${index}`}
          className="ticket-item"
          sx={{
            mb: 2,
            backgroundColor: "grey.800",
            borderLeft: 5,
            borderColor: "primary.main",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              className="ticket-number"
              sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
            >
              #{ticket.ticketNumber}
            </Typography>
            <Typography
              variant="body1"
              className="ticket-event"
              sx={{ mb: 0.5, color: "white" }}
            >
              {ticket.event.name}
            </Typography>
            <Typography
              variant="body2"
              className="ticket-event"
              sx={{ mb: 0.5, color: "grey.300" }}
            >
              📍 {ticket.event.place}
            </Typography>
            <Typography
              variant="body2"
              className="ticket-event"
              sx={{ mb: 0.5, color: "grey.300" }}
            >
              📅{" "}
              {new Date(ticket.event.startDate).toLocaleDateString("cs-CZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography
              variant="body2"
              className="ticket-event"
              sx={{ color: "grey.300" }}
            >
              Cena: {ticket.event.ticketPrice.toLocaleString("cs-CZ")} Kč | ID:{" "}
              {ticket.id}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

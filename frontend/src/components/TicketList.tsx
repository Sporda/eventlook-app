import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Divider,
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h2">
          Vaše lístky ({tickets.length})
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClear}
          size="small"
        >
          Vymazat všechny
        </Button>
      </Box>

      <Box sx={{ mb: 3, p: 2, bgcolor: "primary.50", borderRadius: 2 }}>
        <Typography variant="h6" color="primary">
          Celková hodnota: {totalValue.toLocaleString("cs-CZ")} Kč
        </Typography>
      </Box>

      {tickets.map((ticket, index) => (
        <Card
          key={`${ticket.id}-${index}`}
          sx={{ mb: 2, border: "1px solid", borderColor: "grey.200" }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="primary">
                #{ticket.ticketNumber}
              </Typography>
              <Chip label="Platný" color="success" size="small" />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              {ticket.event.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 {ticket.event.place}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              📅{" "}
              {new Date(ticket.event.startDate).toLocaleDateString("cs-CZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Cena: {ticket.event.ticketPrice.toLocaleString("cs-CZ")} Kč
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {ticket.id}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

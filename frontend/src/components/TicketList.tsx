import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
  Pagination,
} from "@mui/material";
import { toast } from "react-toastify";
import { Ticket } from "../types";

interface TicketListProps {
  tickets: Ticket[];
  onClear: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onClear }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5; // Počet lístků na stránku

  if (tickets.length === 0) return null;

  const totalValue = tickets.reduce(
    (sum, ticket) => sum + ticket.event.ticketPrice,
    0
  );

  // Výpočet paginace
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = tickets.slice(startIndex, endIndex);

  const handleClear = () => {
    onClear();
    setCurrentPage(1); // Reset na první stránku
    toast.success("Všechny lístky byly vymazány");
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

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
          sx={{ color: "white", fontWeight: "bold" }}
        >
          Vaše lístky ({tickets.length})
        </Typography>
        <Button
          variant="outlined"
          className="clear-button"
          onClick={handleClear}
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
          color: "white",
        }}
      >
        Celková hodnota: {totalValue.toLocaleString("cs-CZ")} Kč
      </Paper>

      {currentTickets.map((ticket, index) => (
        <Card
          key={`${ticket.id}-${index}`}
          className="ticket-item"
          sx={{
            mb: 2,
            backgroundColor: "grey.800",
            borderLeft: 5,
            borderColor: "#ff6b00",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              className="ticket-number"
              sx={{ color: "white", fontWeight: "bold", mb: 1 }}
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

      {/* Paginace */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white",
                borderColor: "grey.600",
                "&.Mui-selected": {
                  backgroundColor: "#ff6b00",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#e55a00",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 0, 0.1)",
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

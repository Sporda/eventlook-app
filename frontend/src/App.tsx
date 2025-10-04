import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { EventCard } from "./components/EventCard";
import { PurchaseDialog } from "./components/PurchaseDialog";
import { TicketList } from "./components/TicketList";
import { useEvents } from "./hooks/useEvents";
import { useTicketPurchase } from "./hooks/useTicketPurchase";
import { Event } from "./types";

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    refetch,
  } = useEvents();
  const {
    purchasedTickets,
    loading: purchaseLoading,
    error: purchaseError,
    purchaseTickets,
    clearTickets,
  } = useTicketPurchase();

  const handlePurchaseClick = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handlePurchase = async (
    eventId: number,
    quantity: number
  ): Promise<boolean> => {
    const success = await purchaseTickets({ eventId, quantity });
    if (success) {
      refetch(); // Refresh events to update sold count
    }
    return success;
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const isSoldOut = (event: Event) => {
    return (event.tickets?.length || 0) >= event.ticketCount;
  };

  if (eventsLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          🎫 Eventlook
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Váš spolehlivý partner pro nákup lístků na události
        </Typography>
      </Box>

      {eventsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {eventsError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.id}>
            <EventCard
              event={event}
              onPurchase={handlePurchaseClick}
              isSoldOut={isSoldOut(event)}
            />
          </Grid>
        ))}
      </Grid>

      <PurchaseDialog
        open={dialogOpen}
        event={selectedEvent}
        onClose={handleDialogClose}
        onPurchase={handlePurchase}
        loading={purchaseLoading}
        error={purchaseError}
      />

      <TicketList tickets={purchasedTickets} onClear={clearTickets} />
    </Container>
  );
}

export default App;

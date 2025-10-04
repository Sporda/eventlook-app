import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EventCard } from "./components/EventCard";
import { PurchaseDialog } from "./components/PurchaseDialog";
import { TicketList } from "./components/TicketList";
import { useEvents } from "./hooks/useEvents";
import { useTicketPurchase } from "./hooks/useTicketPurchase";
import { logger } from "./utils/logger";
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
    logger.info(
      `Attempting to purchase ${quantity} tickets for event ${eventId}`,
      "App"
    );

    const success = await purchaseTickets({ eventId, quantity });
    if (success) {
      logger.info(`Purchase successful, refreshing events`, "App");
      // Show success toast after a short delay to ensure it's visible
      setTimeout(() => {
        toast.success(`Nakup proběhl úspěšně`);
      }, 100);
      // Refresh events to update sold count
      refetch();
    } else {
      logger.warn(`Purchase failed for event ${eventId}`, "App");
      toast.error("Nákup se nezdařil. Zkuste to prosím znovu.");
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
      <Box>
        <Box className="eventlook-header">
          <Typography variant="h2" className="logo">
            🎫 Eventlook
          </Typography>
          <Typography variant="h5" className="subtitle">
            Next gen platforma na prodej vstupenek
          </Typography>
        </Box>
        <Container
          maxWidth="lg"
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
        >
          <CircularProgress size={60} />
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      {/* Eventlook Header */}
      <Box className="eventlook-header">
        <Typography variant="h2" className="logo">
          🎫 Eventlook
        </Typography>
        <Typography variant="h5" className="subtitle">
          Next gen platforma na prodej vstupenek
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {eventsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {eventsError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Box>
  );
}

export default App;

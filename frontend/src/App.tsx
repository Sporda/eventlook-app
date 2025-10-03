import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Event, Ticket } from "./types";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [purchasedTickets, setPurchasedTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3001/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      setError("Failed to fetch events: " + error);
    }
  };

  const handlePurchase = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch("http://localhost:3001/tickets/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to purchase tickets");
      }

      const data = await response.json();
      setPurchasedTickets(data.tickets);
      setOpen(false);
      fetchEvents();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Purchase failed");
    }
  };

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setQuantity(1);
    setError(null);
    setOpen(true);
  };

  const isSoldOut = (event: Event | null) => {
    if (!event) return false;
    return event.tickets.length >= event.ticketCount;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Baby Eventlook
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {event.name}
                </Typography>
                <Typography variant="body2">
                  {event.place} - {event.startDate.toLocaleDateString()}
                </Typography>
                <Typography variant="h6">{event.ticketPrice} Kč</Typography>
                <Typography variant="body2">
                  {event.tickets.length} / {event.ticketCount} listků prodáno
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(event)}
                >
                  {isSoldOut(event) ? "Vypredáno" : "Koupit"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Koupit listky</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedEvent?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {selectedEvent?.place} - {selectedEvent?.ticketPrice} Kč
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            type="number"
            label="Počet listků"
            fullWidth
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            disabled={isSoldOut(selectedEvent)}
            inputProps={{
              min: 1,
              max: selectedEvent
                ? selectedEvent.ticketCount - selectedEvent.tickets.length
                : 1,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Zavřít
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isSoldOut(selectedEvent)}
            variant="contained"
            color="primary"
          >
            Koupit
          </Button>
        </DialogActions>
      </Dialog>

      {purchasedTickets.length > 0 && (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Vaše listky
          </Typography>
          {purchasedTickets.map((ticket) => (
            <Card key={ticket.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  Listek #{ticket.ticketNumber}
                </Typography>
                <Typography variant="body2">
                  {ticket.event.name} - {ticket.event.place}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {ticket.event.startDate.toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Container>
      )}
    </Container>
  );
}

export default App;

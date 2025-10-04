import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Event } from "../types";

interface PurchaseDialogProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onPurchase: (eventId: number, quantity: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  open,
  event,
  onClose,
  onPurchase,
  loading,
  error,
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open && event) {
      setQuantity(1);
    }
  }, [open, event]);

  const handlePurchase = async () => {
    if (!event) return;

    const success = await onPurchase(event.id, quantity);
    if (success) {
      onClose();
    }
  };

  const isSoldOut = event ? event.tickets.length >= event.ticketCount : false;
  const maxQuantity = event ? event.ticketCount - event.tickets.length : 1;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Koupit lístky</DialogTitle>
      <DialogContent>
        {event && (
          <>
            <Typography variant="h6" gutterBottom>
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
            <Typography variant="h6" color="primary" gutterBottom>
              {event.ticketPrice.toLocaleString("cs-CZ")} Kč za lístek
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              autoFocus
              margin="dense"
              label="Počet lístků"
              type="number"
              fullWidth
              variant="outlined"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(
                    1,
                    Math.min(maxQuantity, parseInt(e.target.value) || 1)
                  )
                )
              }
              disabled={isSoldOut || loading}
              inputProps={{
                min: 1,
                max: maxQuantity,
              }}
              helperText={`Dostupných: ${maxQuantity} lístků`}
            />

            {quantity > 1 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Celková cena:{" "}
                  {(event.ticketPrice * quantity).toLocaleString("cs-CZ")} Kč
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Zrušit
        </Button>
        <Button
          onClick={handlePurchase}
          variant="contained"
          disabled={isSoldOut || loading || quantity < 1}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Kupuji..." : "Koupit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

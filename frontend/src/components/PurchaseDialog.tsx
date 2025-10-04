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
  Paper,
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

  const isSoldOut = event
    ? (event.tickets?.length || 0) >= event.ticketCount
    : false;
  const maxQuantity = event
    ? event.ticketCount - (event.tickets?.length || 0)
    : 1;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box className="purchase-dialog">
        <DialogTitle
          className="dialog-title"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            backgroundColor: "grey.900",
            borderBottom: 1,
            borderColor: "grey.700",
          }}
        >
          Koupit lístky
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "grey.900", color: "white" }}>
          {event && (
            <>
              <Paper
                className="event-info"
                sx={{ p: 2, mb: 3, backgroundColor: "grey.800" }}
              >
                <Typography
                  variant="h6"
                  className="event-name"
                  sx={{ mb: 1, color: "white" }}
                >
                  {event.name}
                </Typography>
                <Typography
                  variant="body2"
                  className="event-details"
                  sx={{ mb: 0.5, color: "grey.300" }}
                >
                  📍 {event.place}
                </Typography>
                <Typography
                  variant="body2"
                  className="event-details"
                  sx={{ mb: 2, color: "grey.300" }}
                >
                  📅{" "}
                  {new Date(event.startDate).toLocaleDateString("cs-CZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
                <Typography
                  variant="h6"
                  className="event-price"
                  sx={{ color: "primary.main" }}
                >
                  {event.ticketPrice.toLocaleString("cs-CZ")} Kč za lístek
                </Typography>
              </Paper>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box className="quantity-input" sx={{ mb: 2 }}>
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
              </Box>

              {quantity > 1 && (
                <Paper
                  className="total-price"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "primary.main",
                    backgroundColor: "grey.800",
                  }}
                >
                  Celková cena:{" "}
                  {(event.ticketPrice * quantity).toLocaleString("cs-CZ")} Kč
                </Paper>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions
          className="dialog-actions"
          sx={{
            backgroundColor: "grey.900",
            borderTop: 1,
            borderColor: "grey.700",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Button
            variant="outlined"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
            sx={{ color: "grey.300", borderColor: "grey.600" }}
          >
            Zrušit
          </Button>
          <Button
            variant="contained"
            className="purchase-button"
            onClick={handlePurchase}
            disabled={isSoldOut || loading || quantity < 1}
          >
            {loading ? "Kupuji..." : "Koupit"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export interface Event {
  id: number;
  name: string;
  place: string;
  startDate: string;
  ticketCount: number;
  ticketPrice: number;
  tickets: Ticket[];
}

export interface Ticket {
  id: number;
  ticketNumber: string;
  event: {
    id: number;
    name: string;
    place: string;
    startDate: string;
    ticketPrice: number;
  };
}

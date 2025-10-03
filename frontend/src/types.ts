export interface Event {
  id: number;
  name: string;
  place: string;
  startDate: Date;
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
    startDate: Date;
  };
}

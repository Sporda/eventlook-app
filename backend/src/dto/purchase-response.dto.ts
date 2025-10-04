import { Order } from '../entities/order.entity';

export class PurchaseResponseDto {
  order: {
    id: number;
    orderNumber: string;
    createdAt: Date;
  };
  tickets: Array<{
    id: number;
    ticketNumber: string;
    event: {
      id: number;
      name: string;
      place: string;
      startDate: Date;
      ticketPrice: number;
    };
  }>;
}

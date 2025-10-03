import { Order } from '../entities/order.entity';

export class PurchaseResponseDto {
  order: Order;
  tickets: Array<{
    id: number;
    ticketNumber: string;
    event: {
      id: number;
      name: string;
      place: string;
      startDate: Date;
    };
  }>;
}

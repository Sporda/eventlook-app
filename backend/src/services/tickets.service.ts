import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Ticket } from '../entities/ticket.entity';
import { Order } from '../entities/order.entity';
import { PurchaseTicketsDto } from '../dto/purchase-tickets.dto';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';
import { LoggerService } from './logger.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
    private logger: LoggerService,
  ) {}

  async purchaseTickets(
    purchaseDto: PurchaseTicketsDto,
  ): Promise<PurchaseResponseDto> {
    const { eventId, quantity } = purchaseDto;

    this.logger.log(
      `Starting ticket purchase for event ${eventId}, quantity: ${quantity}`,
      'TicketsService',
    );

    // Use transaction for data consistency
    return await this.dataSource.transaction(async (manager) => {
      // Find event first without relations to avoid LEFT JOIN with FOR UPDATE
      const event = await manager.findOne(Event, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      // Get tickets count separately
      const ticketsCount = await manager.count(Ticket, {
        where: { event: { id: eventId } },
      });

      // Check ticket availability
      const soldTickets = ticketsCount;
      const availableTickets = event.ticketCount - soldTickets;

      if (quantity > availableTickets) {
        throw new BadRequestException(
          `Not enough tickets available. Only ${availableTickets} tickets remaining.`,
        );
      }

      // Create order
      const order = manager.create(Order, {
        orderNumber: this.generateOrderNumber(),
        createdAt: new Date(),
      });
      const savedOrder = await manager.save(order);

      // Create tickets
      const tickets: Ticket[] = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = manager.create(Ticket, {
          ticketNumber: this.generateTicketNumber(),
          event,
          order: savedOrder,
        });
        const savedTicket = await manager.save(ticket);
        tickets.push(savedTicket);
      }

      return {
        order: savedOrder,
        tickets: tickets.map((ticket) => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          event: {
            id: event.id,
            name: event.name,
            place: event.place,
            startDate: event.startDate,
            ticketPrice: event.ticketPrice,
          },
        })),
      };
    });
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  private generateTicketNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `TKT-${timestamp}-${random}`;
  }
}

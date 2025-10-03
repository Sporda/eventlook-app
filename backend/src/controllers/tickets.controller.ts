import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Event } from '../entities/event.entity';
import { Order } from '../entities/order.entity';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';

@Controller('tickets')
export class TicketsController {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  @Post('purchase')
  async purchaseTickets(
    @Body() body: { eventId: number; quantity: number },
  ): Promise<PurchaseResponseDto> {
    try {
      const { eventId, quantity } = body;

      // Najdi event
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
        relations: ['tickets'],
      });
      if (!event) {
        throw new NotFoundException('Event not found');
      }

      // Zkontroluj dostupnost listku
      const soldTickets = event.tickets.length;
      if (soldTickets + quantity > event.ticketCount) {
        throw new BadRequestException('Not enough tickets available');
      }

      // Vytvorit objednavku
      const order = new Order();
      order.orderNumber = `ORD-${Date.now()}`;
      order.createdAt = new Date();
      await this.orderRepository.save(order);

      // Vytvorit listky
      const tickets: Ticket[] = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = new Ticket();
        ticket.ticketNumber = `TKT-${Date.now()}-${i + 1}`;
        ticket.event = event;
        ticket.order = order;
        await this.ticketRepository.save(ticket);
        tickets.push(ticket);
      }

      return {
        order,
        tickets: tickets.map((t) => ({
          id: t.id,
          ticketNumber: t.ticketNumber,
          event: {
            id: event.id,
            name: event.name,
            place: event.place,
            startDate: event.startDate,
          },
        })),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to purchase tickets');
    }
  }
}

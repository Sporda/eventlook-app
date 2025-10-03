import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Order } from './order.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticketNumber: string;

  @ManyToOne(() => Event)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => Order)
  @JoinColumn()
  order: Order;
}

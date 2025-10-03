import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  place: string;

  @Column()
  startDate: Date;

  @Column()
  ticketCount: number;

  @Column()
  ticketPrice: number;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];
}

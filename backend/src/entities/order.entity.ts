import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderNumber: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.order)
  tickets: Ticket[];
}

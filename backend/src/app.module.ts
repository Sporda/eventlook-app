import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Event } from './entities/event.entity';
import { Order } from './entities/order.entity';
import { Ticket } from './entities/ticket.entity';
import { EventsController } from './controllers/events.controller';
import { TicketsController } from './controllers/tickets.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'eventlook',
      entities: [Event, Ticket, Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Event, Ticket, Order]),
  ],
  controllers: [AppController, EventsController, TicketsController],
  providers: [AppService],
})
export class AppModule {}

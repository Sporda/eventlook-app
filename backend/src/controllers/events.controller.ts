import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';

@Controller('events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  @Get()
  async findAll(): Promise<Event[]> {
    try {
      return this.eventRepository.find({
        order: { startDate: 'ASC' },
        relations: ['tickets'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch events');
    }
  }
}

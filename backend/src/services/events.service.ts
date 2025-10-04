import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { LoggerService } from './logger.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private logger: LoggerService,
  ) {}

  async findAll(): Promise<Event[]> {
    try {
      this.logger.log('Fetching all events', 'EventsService');
      const events = await this.eventRepository.find({
        order: { startDate: 'ASC' },
        relations: ['tickets'],
      });
      this.logger.log(
        `Successfully fetched ${events.length} events`,
        'EventsService',
      );
      return events;
    } catch (error) {
      this.logger.error('Failed to fetch events', error.stack, 'EventsService');
      throw error;
    }
  }

  async findById(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });
  }
}

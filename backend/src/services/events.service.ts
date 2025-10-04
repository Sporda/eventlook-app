import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      order: { startDate: 'ASC' },
      relations: ['tickets'],
    });
  }

  async findById(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });
  }
}

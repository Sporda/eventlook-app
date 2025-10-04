import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { Event } from '../entities/event.entity';
import { LoggerService } from './logger.service';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  const mockEvent: Event = {
    id: 1,
    name: 'Test Event',
    place: 'Test Place',
    startDate: new Date('2024-12-31'),
    ticketCount: 100,
    ticketPrice: 299,
    tickets: [],
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const events = [mockEvent];
      mockRepository.find.mockResolvedValue(events);

      const result = await service.findAll();

      expect(result).toEqual(events);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { startDate: 'ASC' },
        relations: ['tickets'],
      });
    });
  });

  describe('findById', () => {
    it('should return an event by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockEvent);

      const result = await service.findById(1);

      expect(result).toEqual(mockEvent);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['tickets'],
      });
    });

    it('should return null if event not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });
});

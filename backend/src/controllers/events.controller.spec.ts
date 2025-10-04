import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from '../services/events.service';
import { Event } from '../entities/event.entity';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEvent: Event = {
    id: 1,
    name: 'Test Event',
    place: 'Test Place',
    startDate: new Date('2024-12-31'),
    ticketCount: 100,
    ticketPrice: 299,
    tickets: [],
  };

  const mockEventsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const events = [mockEvent];
      mockEventsService.findAll.mockResolvedValue(events);

      const result = await controller.findAll();

      expect(result).toEqual(events);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});

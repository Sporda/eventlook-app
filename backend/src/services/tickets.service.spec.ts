import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TicketsService } from './tickets.service';
import { Event } from '../entities/event.entity';
import { Ticket } from '../entities/ticket.entity';
import { Order } from '../entities/order.entity';
import { PurchaseTicketsDto } from '../dto/purchase-tickets.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoggerService } from './logger.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let eventRepository: Repository<Event>;
  let ticketRepository: Repository<Ticket>;
  let orderRepository: Repository<Order>;
  let dataSource: DataSource;
  let loggerService: LoggerService;

  const mockEvent: Event = {
    id: 1,
    name: 'Test Event',
    place: 'Test Place',
    startDate: new Date('2024-12-31'),
    ticketCount: 100,
    ticketPrice: 299,
    tickets: [],
  };

  const mockOrder: Order = {
    id: 1,
    orderNumber: 'ORD-123456789-001',
    createdAt: new Date(),
    tickets: [],
  };

  const mockTicket: Ticket = {
    id: 1,
    ticketNumber: 'TKT-123456789-0001',
    event: mockEvent,
    order: mockOrder,
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockEventRepository = {
    findOne: jest.fn(),
  };

  const mockTicketRepository = {
    save: jest.fn(),
  };

  const mockOrderRepository = {
    save: jest.fn(),
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
        TicketsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    ticketRepository = module.get<Repository<Ticket>>(
      getRepositoryToken(Ticket),
    );
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    dataSource = module.get<DataSource>(DataSource);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('purchaseTickets', () => {
    const purchaseDto: PurchaseTicketsDto = {
      eventId: 1,
      quantity: 2,
    };

    it('should successfully purchase tickets', async () => {
      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        return callback({
          findOne: jest.fn().mockResolvedValue(mockEvent),
          create: jest.fn().mockReturnValue(mockOrder),
          save: jest.fn().mockResolvedValue(mockOrder),
        });
      });

      mockDataSource.transaction.mockImplementation(mockTransaction);

      const result = await service.purchaseTickets(purchaseDto);

      expect(result).toHaveProperty('order');
      expect(result).toHaveProperty('tickets');
      expect(result.tickets).toHaveLength(2);
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException when event not found', async () => {
      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        return callback({
          findOne: jest.fn().mockResolvedValue(null),
        });
      });

      mockDataSource.transaction.mockImplementation(mockTransaction);

      await expect(service.purchaseTickets(purchaseDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when not enough tickets available', async () => {
      const eventWithTickets = {
        ...mockEvent,
        tickets: new Array(99).fill({}), // 99 tickets sold, only 1 available
      };

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        return callback({
          findOne: jest.fn().mockResolvedValue(eventWithTickets),
        });
      });

      mockDataSource.transaction.mockImplementation(mockTransaction);

      await expect(service.purchaseTickets(purchaseDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

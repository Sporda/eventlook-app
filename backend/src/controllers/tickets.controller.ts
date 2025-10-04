import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { PurchaseTicketsDto } from '../dto/purchase-tickets.dto';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('purchase')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async purchaseTickets(
    @Body() purchaseDto: PurchaseTicketsDto,
  ): Promise<PurchaseResponseDto> {
    return this.ticketsService.purchaseTickets(purchaseDto);
  }
}

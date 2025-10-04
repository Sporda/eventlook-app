import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class PurchaseTicketsDto {
  @IsNumber()
  @IsPositive()
  eventId: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(10)
  quantity: number;
}

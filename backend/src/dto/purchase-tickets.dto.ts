import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class PurchaseTicketsDto {
  @IsNumber({}, { message: 'ID události musí být číslo' })
  @IsPositive({ message: 'ID události musí být kladné číslo' })
  eventId: number;

  @IsNumber({}, { message: 'Počet lístků musí být číslo' })
  @IsPositive({ message: 'Počet lístků musí být kladné číslo' })
  @Min(1, { message: 'Musíte koupit alespoň 1 lístek' })
  @Max(10, { message: 'Můžete koupit maximálně 10 lístků' })
  quantity: number;
}

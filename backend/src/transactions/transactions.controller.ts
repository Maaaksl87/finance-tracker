import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
// 👇 ВИПРАВЛЕННЯ 1: Перевір шлях! У нас він був '../auth/jwt-auth.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionType } from './schemas/transaction.schema';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any, // 👇 ВИПРАВЛЕННЯ 2: Використовуємо any або правильний тип
  ) {
    // 👇 ВИПРАВЛЕННЯ 3: Міняємо .sub на ._id
    return this.transactionsService.create(createTransactionDto, req.user._id);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: TransactionType,
    @Query('sourceId') sourceId?: string,
  ) {
    // 👇 ВИПРАВЛЕННЯ 4: ._id
    return this.transactionsService.findAll(
      req.user._id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      type,
      sourceId,
    );
  }

  @Get('stats')
  getStats(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // 👇 ВИПРАВЛЕННЯ 5: ._id
    return this.transactionsService.getStats(
      req.user._id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    // 👇 ВИПРАВЛЕННЯ 6: ._id
    return this.transactionsService.findOne(id, req.user._id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    // 👇 ВИПРАВЛЕННЯ 7: ._id
    return this.transactionsService.remove(id, req.user._id);
  }
}

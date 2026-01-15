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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionType } from './schemas/transaction.schema';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: {
    _id: string;
    email: string;
    name?: string;
  };
}

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.transactionsService.create(createTransactionDto, req.user._id);
  }

  @Get()
  findAll(
    @Request() req: RequestWithUser, // 👈 І тут
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: TransactionType,
    @Query('sourceId') sourceId?: string,
  ) {
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
    @Request() req: RequestWithUser, // 👈 І тут
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsService.getStats(
      req.user._id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.transactionsService.findOne(id, req.user._id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.transactionsService.remove(id, req.user._id);
  }
}

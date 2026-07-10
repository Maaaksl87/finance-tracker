import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { RequestWithUser } from "../common/interfaces/request-with-user.interface";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionType } from "./schemas/transaction.schema";
import { TransactionsService } from "./transactions.service";
import { BadRequestException } from "@nestjs/common";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.transactionsService.create(createTransactionDto, req.user._id);
  }

  @Get()
  findAll(
    @Request() req: RequestWithUser,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("type") type?: TransactionType,
    @Query("sourceId") sourceId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.transactionsService.findAll(
      req.user._id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : undefined,
      type,
      sourceId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get("stats")
  getStats(
    @Request() req: RequestWithUser,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.transactionsService.getStats(
      req.user._id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get("calendar")
  getCalendar(
    @Request() req: RequestWithUser,
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("timezone") timezone?: string
  ) {
    if (!from || !to) {
      throw new BadRequestException("Параметри from і to обов'язкові");
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException("Некоректний формат дати");
    }

    return this.transactionsService.getCalendar(req.user._id, fromDate, toDate, timezone ?? "UTC");
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Request() req: RequestWithUser) {
    return this.transactionsService.findOne(id, req.user._id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: RequestWithUser) {
    return this.transactionsService.remove(id, req.user._id);
  }
}

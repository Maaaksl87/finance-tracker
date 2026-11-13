import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { RequestWithUser } from "../common/interfaces/request-with-user.interface";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";

@UseGuards(JwtAuthGuard)
@Controller("budgets")
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req: RequestWithUser) {
    return this.budgetsService.create(createBudgetDto, req.user._id);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.budgetsService.findAll(req.user._id);
  }

  @Get("status")
  getStatus(@Request() req: RequestWithUser, @Query("month") month?: string) {
    return this.budgetsService.getStatus(req.user._id, month);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Request() req: RequestWithUser) {
    return this.budgetsService.findOne(id, req.user._id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Request() req: RequestWithUser,
  ) {
    return this.budgetsService.update(id, updateBudgetDto, req.user._id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: RequestWithUser) {
    return this.budgetsService.remove(id, req.user._id);
  }
}

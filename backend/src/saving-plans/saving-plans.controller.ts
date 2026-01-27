import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SavingPlansService } from './saving-plans.service';
import { CreateSavingPlanDto } from './dto/create-saving-plan.dto';
import { UpdateSavingPlanDto } from './dto/update-saving-plan.dto';
import { AddFundsDto } from './dto/add-funds.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('saving-plans')
@UseGuards(JwtAuthGuard)
export class SavingPlansController {
  constructor(private readonly savingPlansService: SavingPlansService) {}

  @Post()
  create(
    @Request() req: RequestWithUser,
    @Body() createDto: CreateSavingPlanDto,
  ) {
    return this.savingPlansService.create(req.user._id, createDto);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.savingPlansService.findAll(req.user._id);
  }

  @Get('stats')
  getStats(@Request() req: RequestWithUser) {
    return this.savingPlansService.getStats(req.user._id);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.savingPlansService.findOne(req.user._id, id);
  }

  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateSavingPlanDto,
  ) {
    return this.savingPlansService.update(req.user._id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.savingPlansService.remove(req.user._id, id);
  }

  @Post(':id/add-funds')
  addFunds(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() addFundsDto: AddFundsDto,
  ) {
    return this.savingPlansService.addFunds(
      req.user._id,
      id,
      addFundsDto.amount,
    );
  }
  @Post(':id/withdraw')
  withdrawFunds(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() withdrawDto: AddFundsDto,
  ) {
    return this.savingPlansService.withdrawFunds(
      req.user._id,
      id,
      withdrawDto.amount,
    );
  }
}

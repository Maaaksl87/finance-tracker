import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { CreateCategoryDto } from './dto/create-category.dto';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: RequestWithUser,
  ) {
    return this.categoriesService.create(createCategoryDto, req.user._id);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.categoriesService.findAll(req.user._id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: RequestWithUser) {
    return this.categoriesService.remove(id, req.user._id);
  }
}

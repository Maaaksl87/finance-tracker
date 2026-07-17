import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, CategoryDocument } from './schemas/categories.schema';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) { }

    async create(createCategoryDto: CreateCategoryDto, userId: string) {
        const name = createCategoryDto.name.trim();

        const duplicate = await this.categoryModel.findOne({ userId: new Types.ObjectId(userId), type: createCategoryDto.type, name }).exec();
        if (duplicate) throw new ConflictException("Така категорія вже існує");

        try {
            const newCategory = new this.categoryModel({
                ...createCategoryDto,
                name,
                userId: new Types.ObjectId(userId),
            });
            return newCategory.save();
        } catch (error) {
            if (error.code === 11000) throw new ConflictException("Така категорія вже існує");
            throw error;
        }
    }

    async findAll(userId: string) {
        return this.categoryModel.find({ userId: new Types.ObjectId(userId) }).sort({ type: 1, name: 1 }).exec();
    }

    async remove(id: string, userId: string) {
        const category = await this.categoryModel.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) }).exec();
        if (!category) throw new NotFoundException("Схоже, що такої категорії не існує");
        return category;
    }
}

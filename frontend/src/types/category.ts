import type { Color } from "./sources";

export interface Category {
    _id: string;
    name: string;
    type: "income" | "expense";
    color: Color;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateCategoryDto = Pick<Category, "name" | "type" | "color">;

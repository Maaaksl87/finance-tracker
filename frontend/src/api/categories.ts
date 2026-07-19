import api from "./axios";
import type { Category, CreateCategoryDto } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
}

export const createCategory = async (dto: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>("/categories", dto);
    return response.data;
}

export const deleteCategory = async (id: string): Promise<Category> => {
    const response = await api.delete<Category>(`/categories/${id}`);
    return response.data;
}
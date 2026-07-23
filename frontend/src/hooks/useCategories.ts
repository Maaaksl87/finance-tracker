import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, deleteCategory } from "@/api/categories";
import type { CreateCategoryDto } from "@/types";


export const categoriesKey = {
    all: ['categories'] as const,
};

export function useCategories() {
    const { data, isLoading, error } = useQuery({
        queryKey: categoriesKey.all,
        queryFn: getCategories,
    });
    return { categories: data ?? [], isLoading, error };
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriesKey.all });
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriesKey.all });
        },
    })
}
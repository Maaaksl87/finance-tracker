import { createSource, deleteSource, getSources, updateSource } from "@/api/sources"
import type { UpdateSourceDto } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const sourcesKeys = {
    all: ['sources'] as const,
    lists: () => [...sourcesKeys.all, "list"] as const,

}

export function useSources() {
    return useQuery({
        queryKey: sourcesKeys.lists(),
        queryFn: getSources,
    })
}

export function useCreateSource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSource,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: sourcesKeys.lists(),
            });
        },
        onError: (error) => {
            console.error("Помилка створення:", error);
        },
    });
}

export function useUpdateSource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSourceDto }) =>
            updateSource(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: sourcesKeys.lists(),
            });
        },
        onError: (error) => {
            console.error("Помилка оновлення:", error);
        },
    });
}

export function useDeleteSource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSource(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: sourcesKeys.lists(),
            });
        },
        onError: (error) => {
            console.error("Помилка видалення:", error);
        },
    });
}
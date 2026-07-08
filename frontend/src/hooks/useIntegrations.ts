import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectExchange, syncIntegrations } from "@/api/integrationsApi";
import { sourcesKeys } from "./useSources";

export function useConnectCrypto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ exchange, apiKey, apiSecret }: { exchange: string; apiKey: string; apiSecret: string }) =>
            connectExchange(apiKey, apiSecret, exchange),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sourcesKeys.lists() });
        },
    });
}

export function useSyncIntegrations() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (force: boolean = false) => syncIntegrations(force),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sourcesKeys.lists() });
        },
    });
}
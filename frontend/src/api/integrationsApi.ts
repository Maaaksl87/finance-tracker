import api from "./axios";

export const connectExchange = async (apiKey: string, apiSecret: string, exchange: string) => {
    const { data } = await api.post("/integrations", { exchange, apiKey, apiSecret });
    return data;
}

export const syncIntegrations = async (force: boolean) => {
    const { data } = await api.post('/integrations/sync', { force });
    return data;
}
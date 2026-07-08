export interface ExchangeProvider {
    readonly exchange: string;

    validateCredentials(apiKey: string, apiSecret: string): Promise<void>;
    getTotalBalance(apiKey: string, apiSecret: string): Promise<number>;

}
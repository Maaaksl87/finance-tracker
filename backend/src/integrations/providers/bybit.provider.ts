import { RestClientV5 } from "bybit-api";
import { ExchangeProvider } from "./exchange-provider.interface";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class BybitProvider implements ExchangeProvider {
    readonly exchange = "bybit";

    private createClient(apiKey: string, apiSecret: string) {
        return new RestClientV5({
            key: apiKey, secret: apiSecret, testnet: true, enable_time_sync: true,
        });
    }

    async validateCredentials(apiKey: string, apiSecret: string): Promise<void> {
        await this.fetchBalance(apiKey, apiSecret);
    }

    async getTotalBalance(apiKey: string, apiSecret: string): Promise<number> {
        return this.fetchBalance(apiKey, apiSecret);
    }

    private async fetchBalance(apiKey: string, apiSecret: string) {
        const client = this.createClient(apiKey, apiSecret);

        try {
            const result = await client.getWalletBalance({
                accountType: "UNIFIED",
            })

            if (result.retCode !== 0) {
                throw new BadRequestException(`Bybit: ${result.retMsg}`)
            }

            return Number(result.result.list[0]?.totalEquity ?? 0);
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException("Не вдалося отримати баланс з Bybit");
        }

    }
}
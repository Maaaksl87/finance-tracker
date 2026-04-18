import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { CurrencyRate } from "../common/interfaces/currency-rate.interface";

@Injectable()
export class CurrenciesService implements OnModuleInit {
  private readonly logger = new Logger(CurrenciesService.name);
  private cachedRates: CurrencyRate[] = [];
  async onModuleInit() {
    this.logger.log("Перше завантаження даних...");
    await this.fetchMonobankData();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.debug("Оновлення валютних курсів...");
    await this.fetchMonobankData();
  }

  private async fetchMonobankData() {
    try {
      const response = await fetch("https://api.monobank.ua/bank/currency");
      if (!response.ok) {
        throw new Error(`Помилка запиту: ${response.status}`);
      }

      this.cachedRates = await response.json();
      this.logger.log("Успішно отримано дані від Monobank");
    } catch (error) {
      this.logger.error("Помилка при запиті до Monobank:", error);
    }
  }
  getRates() {
    return this.cachedRates;
  }
}

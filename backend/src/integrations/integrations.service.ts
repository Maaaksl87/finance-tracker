import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { ExchangeProvider } from './providers/exchange-provider.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SourcesService } from "../sources/sources.service";
import { Model, Types } from 'mongoose';
import { Integration } from './schemas/integrations.schema';
import { BybitProvider } from './providers/bybit.provider';
import { decryptSecret, encryptSecret } from './crypto.util';

@Injectable()
export class IntegrationsService {
  private readonly providers: Map<string, ExchangeProvider>

  constructor(
    @InjectModel(Integration.name) private integrationModel: Model<Integration>,
    private readonly sourceService: SourcesService,
    bybitProvider: BybitProvider,
  ) {
    this.providers = new Map([
      [bybitProvider.exchange, bybitProvider],
    ])
  }

  private getProvider(exchange: string) {
    const provider = this.providers.get(exchange);

    if (!provider) {
      throw new BadRequestException(`Біржа ${exchange} не підтримується`);
    }
    return provider;

  }

  async create(userId: string, dto: CreateIntegrationDto) {
    const provider = this.getProvider(dto.exchange);
    const balance = await provider.getTotalBalance(dto.apiKey, dto.apiSecret);

    const source = await this.sourceService.create(
      {
        name: provider.exchange,
        balance,
        type: 'crypto',
        currency: 'USD',
        color: 'yellow',
      },
      userId,
    );

    return this.integrationModel.create({
      exchange: dto.exchange,
      apiKey: dto.apiKey,
      apiSecretEncrypted: encryptSecret(dto.apiSecret),
      userId: new Types.ObjectId(userId),
      sourceId: source._id,
      lastSyncedAt: new Date(),
    })
  }

  //Оновлення балансу підключеного аккаунта
  async sync(userId: string, integrationId: string) {
    const integration = await this.integrationModel.findOne({
      _id: integrationId,
      userId: new Types.ObjectId(userId),
    });

    if (!integration) {
      throw new NotFoundException("Схоже що інтеграцію не знайдено.");

    }
    const provider = this.getProvider(integration.exchange);

    const balance = await provider.getTotalBalance(
      integration.apiKey,
      decryptSecret(integration.apiSecretEncrypted),
    );

    await this.sourceService.update(String(integration.sourceId), { balance }, userId,)

    integration.lastSyncedAt = new Date();
    await integration.save();
    return { sourceId: integration.sourceId, balance };
  }

  //Оновлення балансу всіх підключених аккаунтів (кнопка)
  async syncAll(userId: string, force = false) {
    const MAX_AGE_MS = 2 * 60 * 1000;
    const integrations = await this.integrationModel.find({
      userId: new Types.ObjectId(userId),
    });

    const results = [];

    for (const integration of integrations) {
      const isFresh =
        integration.lastSyncedAt &&
        Date.now() - integration.lastSyncedAt.getTime() < MAX_AGE_MS;
      if (isFresh && !force) continue;

      try {
        results.push(await this.sync(userId, String(integration._id)));
      } catch (error) {
        console.error(`Sync failed for ${integration._id}:`, error);
      }
    }
    return results;
  }

}

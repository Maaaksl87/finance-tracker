import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SourcesModule } from "src/sources/sources.module";

import { IntegrationsController } from "./integrations.controller";
import { IntegrationsService } from "./integrations.service";
import { Integration, IntegrationSchema } from "./schemas/integrations.schema";
import { BybitProvider } from "./providers/bybit.provider";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Integration.name, schema: IntegrationSchema }]),
    SourcesModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, BybitProvider],
})
export class IntegrationsModule { }

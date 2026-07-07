import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { type RequestWithUser } from "src/common/interfaces/request-with-user.interface";

import { CreateIntegrationDto } from "./dto/create-integration.dto";
import { IntegrationsService } from "./integrations.service";

@UseGuards(JwtAuthGuard)
@Controller("integrations")
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) { }

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateIntegrationDto) {
    return this.integrationsService.create(req.user._id, dto);
  }

  @Post("sync")
  syncAll(@Req() req: RequestWithUser, @Body() body: { force?: boolean }) {
    return this.integrationsService.syncAll(req.user._id, body?.force ?? false);
  }

  @Post(":id/sync")
  sync(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.integrationsService.sync(req.user._id, id);
  }

}

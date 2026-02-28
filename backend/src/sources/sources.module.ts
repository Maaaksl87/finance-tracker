import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Source, SourceSchema } from './schemas/source.schema';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';

@Module({
  controllers: [SourcesController],
  providers: [SourcesService],
  imports: [MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }])],
  exports: [SourcesService],
})
export class SourcesModule {}

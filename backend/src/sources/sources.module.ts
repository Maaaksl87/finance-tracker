import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Source, SourceSchema } from './schemas/source.schema';

@Module({
  controllers: [SourcesController],
  providers: [SourcesService],
  imports: [
    MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }]),
  ],
})
export class SourcesModule {}

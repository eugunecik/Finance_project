import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './openai.service';
import { CategoriesModule } from '../categories/categories.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CategoriesModule, 
  ],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class AIModule {}
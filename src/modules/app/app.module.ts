import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import configurations from '../../configurations'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from 'src/token/token.module';
import { ReceiptsModule } from '../receipts/receipts.module';
import { Receipt } from '../receipts/models/receipt.model';
import { ExpenseItemsModule } from '../expense-items/expense-items.module'; 
import { ExpenseItem } from '../expense-items/models/expense-item.model'; 
import { CategoriesModule } from '../categories/categories.module';
import { Category } from '../categories/models/category.model';
import { PhotosModule } from '../photos/photos.module';
import { Photo } from '../photos/models/photo.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SearchesModule } from '../search/search.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations]
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: "postgres",
        host: configService.get("db_host"),      
        port: configService.get("db_port"),
        username: configService.get("db_user"),
        password: configService.get("db_password"),
        database: configService.get("db_name"),
        synchronize: true,
        autoLoadModels: true,
        models: [User, Receipt, ExpenseItem, Category, Photo]
      })
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule, 
    AuthModule, 
    TokenModule, 
    ReceiptsModule, 
    ExpenseItemsModule, 
    CategoriesModule,
    PhotosModule,
    SearchesModule
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
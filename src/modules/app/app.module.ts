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

@Module({
  imports: [ConfigModule.forRoot({
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
      models: [User, Receipt, ExpenseItem]
    })
  }),
  UsersModule, AuthModule, TokenModule, ReceiptsModule, ExpenseItemsModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
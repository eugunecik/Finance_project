import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.useGlobalPipes(new ValidationPipe());
  
  const config = new DocumentBuilder()
    .setTitle("Lesson api")
    .setDescription("Finance Api")
    .setVersion("1.0")
    .addTag("API")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  

  SwaggerModule.setup('api', app, document, {
    customCss: `
      .swagger-ui .parameters-col_description input {
        color: #000 !important;
      }
      .swagger-ui .auth-container input {
        color: #000 !important;
      }
      .swagger-ui input[type=text] {
        color: #000 !important;
      }
    `,
    swaggerOptions: {
      persistAuthorization: true, 
    },
  });
  
  await app.listen(port);
}
bootstrap();
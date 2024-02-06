import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CORS_OPTIONS } from './constant/cors.constant';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.enableCors(CORS_OPTIONS);
  // app.use('view engine', 'pug')
  app.setViewEngine('pug');
  await app.listen(4890);

}
bootstrap();

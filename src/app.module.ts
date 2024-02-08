import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlOrmConfigService } from "./config/mysql.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import KecamatanEntity from './model/kecamatan.entity';
import WilayahEntity from './model/wilayah.entity';
import kelurahanEntity from './model/kelurahan.entity';
import tpsEntity from './model/tps.entity';
import userEntity from './model/user.entity';
import DataCapresEntity from './model/dataCapres.entity';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, ".."),
    renderPath: "public",
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule.forRoot({ isGlobal: true, cache: true }),],
    inject: [ConfigService],

    useFactory: async (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get("DB_HOST"),
      port: parseInt(configService.get("DB_PORT")),
      username: configService.get("DB_USER"),
      password: configService.get("DB_PASS"),
      database: configService.get("DB_NAME"),
      entities: [__dirname + "/../**/*.entity.js"],
    }),
  }),
  TypeOrmModule.forFeature([
    KecamatanEntity,
    WilayahEntity,
    kelurahanEntity,
    tpsEntity,
    tpsEntity,
    userEntity,
    DataCapresEntity
  ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

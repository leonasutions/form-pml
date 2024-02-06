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

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, ".."),
    renderPath: "public",
  }),


  // TypeOrmModule.forRoot({
  //   name: "PEMILU_DB",
  //   type: "mysql",
  //   host: "116.66.206.189",
  //   port: 3306,
  //   username: "udaka_svc",
  //   password: "udaka2022",
  //   database: "pemilu",
  //   synchronize: false,
  //   extra: {
  //     poolSize: 20,
  //     connectionTimeoutMillis: 60000,
  //     query_timeout: 30000,
  //     statement_timeout: 30000,
  //   }, //use this with development enviroment
  // }), 
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      type: 'mysql',
      host: '116.66.206.189',
      port: parseInt('3306'),
      username: 'udaka_svc',
      password: 'udaka2022',
      database: 'pemilu',
      entities: [__dirname + "/../**/*.entity.js"],
    }),
  }),
    TypeOrmModule.forFeature([
      KecamatanEntity,
      WilayahEntity,
      kelurahanEntity,
      tpsEntity,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class MysqlOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mysql",
      host: this.configService.get<string>("DB_HOST"),
      port: this.configService.get<number>("DB_PORT") as number,
      username: this.configService.get<string>("DB_USER"),
      password: this.configService.get<string>("DB_PASS"),
      database: this.configService.get<string>("DB_NAME"),
      logging: this.configService.get<boolean>("APP_DEBUG", false),
      entities: [__dirname + "/../**/*.entity.js"],
      autoLoadEntities: true,
      synchronize: false,
      bigNumberStrings: false,
    };
  }
}

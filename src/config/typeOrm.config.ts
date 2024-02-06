import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";


config();

const configService = new ConfigService();

export default new DataSource({
  type: "mysql",
  host: configService.get("DB_HOST"),
  port: configService.get("DB_PORT"),
  username: configService.get("DB_USER"),
  password: configService.get("DB_PASS"),
  database: configService.get("DB_NAME"),
  entities: ["src/v1/**/*.entity{.js,.ts}"],
  connectTimeout:10000000,
  migrations: ["src/database/migrations/*.ts"],
});

import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public ENABLE_APM: boolean | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;

  public API_GATEWAY_URL: string | undefined;
  public CLIENT_URL: string | undefined;

  public RABBITMQ_ENDPOINT: string | undefined;

  public ELASTIC_SEARCH_URL: string | undefined;
  public ELASTIC_APM_SERVER_URL: string | undefined;
  public ELASTIC_APM_SECRET_TOKEN: string | undefined;

  public MYSQL_DB: string | undefined;

  public CLOUDINARY_NAME: string | undefined;
  public CLOUDINARY_NAME_API_KEY: string | undefined;
  public CLOUDINARY_NAME_API_SECRET: string | undefined;

  constructor() {
    this.ENABLE_APM = process.env.ENABLE_APM === '0';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV;

    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL;
    this.CLIENT_URL = process.env.CLIENT_URL;

    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT;

    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL;
    this.ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL;
    this.ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN;

    this.MYSQL_DB = process.env.MYSQL_DB;

    this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
    this.CLOUDINARY_NAME_API_KEY = process.env.CLOUDINARY_NAME_API_KEY;
    this.CLOUDINARY_NAME_API_SECRET = process.env.CLOUDINARY_NAME_API_SECRET;
  }
}

export const config: Config = new Config();

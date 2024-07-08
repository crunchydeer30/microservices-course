import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public PORT: number | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public ELASTIC_URL: string | undefined;

  constructor() {
    this.PORT = Number(process.env.PORT);
    this.NODE_ENV = process.env.NODE_ENV;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT;
    this.SENDER_EMAIL = process.env.SENDER_EMAIL;
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
    this.ELASTIC_URL = process.env.ELASTIC_URL;
  }
}

export const config: Config = new Config();

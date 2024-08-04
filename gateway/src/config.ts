import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public ENABLE_APM: boolean | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public AUTH_BASE_URL: string | undefined;
  public USERS_BASE_URL: string | undefined;
  public GIGS_BASE_URL: string | undefined;
  public MESSAGES_BASE_URL: string | undefined;
  public ORDERS_BASE_URL: string | undefined;
  public REVIEWS_BASE_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public REDIS_PORT: number | undefined;
  public ELASTIC_URL: string | undefined;
  public ELASTIC_AMP_URL: string | undefined;
  public ELASTIC_APM_SECRET_TOKEN: string | undefined;

  constructor() {
    this.ENABLE_APM = Boolean(process.env.ENABLE_APM);
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL;
    this.USERS_BASE_URL = process.env.USERS_BASE_URL;
    this.GIGS_BASE_URL = process.env.GIGS_BASE_URL;
    this.MESSAGES_BASE_URL = process.env.MESSAGES_BASE_URL;
    this.ORDERS_BASE_URL = process.env.ORDERS_BASE_URL;
    this.REVIEWS_BASE_URL = process.env.REVIEWS_BASE_URL;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.REDIS_PORT = Number(process.env.REDIS_PORT);
    this.ELASTIC_URL = process.env.ELASTIC_URL;
    this.ELASTIC_AMP_URL = process.env.ELASTIC_AMP_URL;
    this.ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN;
  }
}

export const config: Config = new Config();

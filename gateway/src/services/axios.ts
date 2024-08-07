import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { config } from '@gateway/config';

export class AxiosService {
  public axios: ReturnType<typeof axios.create>;

  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.axiosCreateInstance(baseUrl, serviceName);
  }

  public axiosCreateInstance(baseUrl: string, serviceName?: string): ReturnType<typeof axios.create> {
    let requestGatewayToken = '';
    if (serviceName) {
      requestGatewayToken = sign({ serviceName }, config.GATEWAY_JWT_TOKEN!);
    }
    return axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewayToken: requestGatewayToken,
      },
      withCredentials: true,
    });
  }
}

const axiosTest = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth');

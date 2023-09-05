import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  get<T>(url: string): Promise<T> {
    try {
      const {} = axios.get<T>(url);
      return;
    } catch (error) {
      throw new Error('Error on axios adapter');
    }
  }
}

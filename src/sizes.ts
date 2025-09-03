import { Auth } from './auth';
import { PaginationParams, FlavorsResponse, VolumeSizesResponse } from './types';

/**
 * ES: Clase para manejar operaciones de tamaños (flavors y volúmenes)
 * EN: Class to handle sizes operations (flavors and volumes)
 */
export class Sizes {
  private readonly auth: Auth;
  private readonly baseUrl: string;

  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todos los flavors disponibles
   * EN: Lists all available flavors
   */
  async getFlavors(params: PaginationParams = {}): Promise<FlavorsResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/sizes/flavors`);
    
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Lista todos los tamaños de volumen disponibles
   * EN: Lists all available volume sizes
   */
  async getVolumeSizes(params: PaginationParams = {}): Promise<VolumeSizesResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/sizes/volumes`);
    
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
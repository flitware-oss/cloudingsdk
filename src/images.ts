import { Auth } from './auth';
import { PaginationParams, Image, ImagesResponse } from './types';

/**
 * ES: Clase para manejar operaciones de imágenes
 * EN: Class to handle images operations
 */
export class Images {
  private readonly auth: Auth;
  private readonly baseUrl: string;
  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todas las imágenes
   * EN: Lists all images
   */
  async getImages(params: PaginationParams = {}): Promise<ImagesResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/images`);
    
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
   * ES: Obtiene una imagen específica por ID
   * EN: Gets a specific image by ID
   */
  async getImageById(id: string): Promise<Image> {
    const response = await fetch(`${this.baseUrl}/v1/images/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
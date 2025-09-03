import { Auth } from './auth';
import { PaginationParams, PaginatedResponse, AccountLimit } from './types';

/**
 * ES: Clase para manejar operaciones de cuenta
 * EN: Class to handle account operations
 */
export class Account {
  private readonly auth: Auth;
  private readonly baseUrl: string;

  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todos los límites de la cuenta
   * EN: Lists all account limits
   */
  async getLimits(params: PaginationParams = {}): Promise<PaginatedResponse<AccountLimit>> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/account/limits`);
    
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
   * ES: Obtiene un límite específico por nombre
   * EN: Gets a specific limit by name
   */
  async getLimitByName(name: string): Promise<AccountLimit> {
    const response = await fetch(`${this.baseUrl}/v1/account/limits/${name}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
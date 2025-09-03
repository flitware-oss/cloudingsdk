import { Auth } from './auth';
import { PaginationParams, Action, ActionsResponse } from './types';

/**
 * ES: Clase para manejar operaciones de acciones
 * EN: Class to handle actions operations
 */
export class Actions {
  private readonly auth: Auth;
  private readonly baseUrl: string;

  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todas las acciones
   * EN: Lists all actions
   */
  async getActions(params: PaginationParams = {}): Promise<ActionsResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/actions`);
    
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
   * ES: Obtiene una acción específica por ID
   * EN: Gets a specific action by ID
   */
  async getActionById(id: string): Promise<Action> {
    const response = await fetch(`${this.baseUrl}/v1/actions/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
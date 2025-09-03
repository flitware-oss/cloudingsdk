import { Auth } from './auth';
import { 
  PaginationParams, 
  Server, 
  ServersResponse, 
  CreateServerRequest,
  ReinstallServerRequest,
  Action
} from './types';

/**
 * ES: Clase para manejar operaciones de servidores
 * EN: Class to handle servers operations
 */
export class Servers {
  private readonly auth: Auth;
  private readonly baseUrl: string;

  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todos los servidores
   * EN: Lists all servers
   */
  async getServers(params: PaginationParams = {}): Promise<ServersResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/servers`);
    
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
   * ES: Crea un nuevo servidor
   * EN: Creates a new server
   */
  async createServer(data: CreateServerRequest): Promise<Server> {
    const response = await fetch(`${this.baseUrl}/v1/servers`, {
      method: 'POST',
      headers: { ...this.auth.getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Obtiene un servidor específico por ID
   * EN: Gets a specific server by ID
   */
  async getServerById(id: string): Promise<Server> {
    const response = await fetch(`${this.baseUrl}/v1/servers/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Elimina un servidor
   * EN: Deletes a server
   */
  async deleteServer(id: string): Promise<Action> {
    const response = await fetch(`${this.baseUrl}/v1/servers/${id}`, {
      method: 'DELETE',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Reinstala un servidor
   * EN: Reinstalls a server
   */
  async reinstallServer(id: string, data: ReinstallServerRequest): Promise<Server> {
    const response = await fetch(`${this.baseUrl}/v1/servers/${id}/reinstall`, {
      method: 'POST',
      headers: { ...this.auth.getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
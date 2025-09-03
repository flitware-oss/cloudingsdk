import { Auth } from './auth';
import { 
  PaginationParams, 
  SSHKey, 
  SSHKeysResponse, 
  CreateSSHKeyRequest,
  GenerateSSHKeyRequest
} from './types';

/**
 * ES: Clase para manejar operaciones de SSH keys
 * EN: Class to handle SSH keys operations
 */
export class SSHKeys {
  private readonly auth: Auth;
  private readonly baseUrl: string;

  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todas las SSH keys
   * EN: Lists all SSH keys
   */
  async getSSHKeys(params: PaginationParams = {}): Promise<SSHKeysResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/keypairs`);
    
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
   * ES: Crea una nueva SSH key
   * EN: Creates a new SSH key
   */
  async createSSHKey(data: CreateSSHKeyRequest): Promise<SSHKey> {
    const response = await fetch(`${this.baseUrl}/v1/keypairs`, {
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
   * ES: Obtiene una SSH key específica por ID
   * EN: Gets a specific SSH key by ID
   */
  async getSSHKeyById(id: string): Promise<SSHKey> {
    const response = await fetch(`${this.baseUrl}/v1/keypairs/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Elimina una SSH key
   * EN: Deletes an SSH key
   */
  async deleteSSHKey(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/keypairs/${id}`, {
      method: 'DELETE',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Genera una nueva SSH key en el servidor
   * EN: Generates a new SSH key on the server
   */
  async generateSSHKey(data: GenerateSSHKeyRequest): Promise<SSHKey> {
    const response = await fetch(`${this.baseUrl}/v1/keypairs/generate`, {
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
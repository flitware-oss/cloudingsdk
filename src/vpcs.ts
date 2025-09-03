import { Auth } from './auth';
import { 
  PaginationParams, 
  VPC, 
  VPCsResponse, 
  CreateVPCRequest,
  UpdateVPCRequest
} from './types';

/**
 * ES: Clase para manejar operaciones de VPCs
 * EN: Class to handle VPCs operations
 */
export class VPCs {
  private readonly auth: Auth;
  private readonly baseUrl: string;
  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todas las VPCs
   * EN: Lists all VPCs
   */
  async getVPCs(params: PaginationParams = {}): Promise<VPCsResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/vpcs`);
    
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
   * ES: Crea una nueva VPC
   * EN: Creates a new VPC
   */
  async createVPC(data: CreateVPCRequest): Promise<VPC> {
    const response = await fetch(`${this.baseUrl}/v1/vpcs`, {
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
   * ES: Obtiene una VPC específica por ID
   * EN: Gets a specific VPC by ID
   */
  async getVPCById(id: string): Promise<VPC> {
    const response = await fetch(`${this.baseUrl}/v1/vpcs/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Actualiza una VPC
   * EN: Updates a VPC
   */
  async updateVPC(id: string, data: UpdateVPCRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/vpcs/${id}`, {
      method: 'PATCH',
      headers: { ...this.auth.getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Elimina una VPC
   * EN: Deletes a VPC
   */
  async deleteVPC(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/vpcs/${id}`, {
      method: 'DELETE',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Establece una VPC como predeterminada
   * EN: Sets a VPC as default
   */
  async setVPCAsDefault(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/vpcs/${id}/set-default`, {
      method: 'POST',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}
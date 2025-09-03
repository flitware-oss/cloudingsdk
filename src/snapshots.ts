import { Auth } from './auth';
import { PaginationParams, Snapshot, SnapshotsResponse, UpdateSnapshotRequest, Action } from './types';

/**
 * ES: Clase para manejar operaciones de snapshots
 * EN: Class to handle snapshots operations
 */
export class Snapshots {
  private readonly auth: Auth;
  private readonly baseUrl: string;
  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todos los snapshots
   * EN: Lists all snapshots
   */
  async getSnapshots(params: PaginationParams = {}): Promise<SnapshotsResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/snapshots`);
    
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
   * ES: Obtiene un snapshot específico por ID
   * EN: Gets a specific snapshot by ID
   */
  async getSnapshotById(id: string): Promise<Snapshot> {
    const response = await fetch(`${this.baseUrl}/v1/snapshots/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Actualiza un snapshot
   * EN: Updates a snapshot
   */
  async updateSnapshot(id: string, data: UpdateSnapshotRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/snapshots/${id}`, {
      method: 'PATCH',
      headers: { ...this.auth.getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Elimina un snapshot
   * EN: Deletes a snapshot
   */
  async deleteSnapshot(id: string): Promise<Action> {
    const response = await fetch(`${this.baseUrl}/v1/snapshots/${id}`, {
      method: 'DELETE',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
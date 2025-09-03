import { Auth } from './auth';
import { BackupListParams, Backup, BackupsResponse } from './types';

/**
 * ES: Clase para manejar operaciones de backups
 * EN: Class to handle backups operations
 */
export class Backups {
  private readonly auth: Auth;
  private readonly baseUrl: string;

  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todos los backups
   * EN: Lists all backups
   */
  async getBackups(params: BackupListParams = {}): Promise<BackupsResponse> {
    const { page = 1, pageSize = 20, serverId } = params;
    const url = new URL(`${this.baseUrl}/v1/backups`);
    
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());
    
    if (serverId) {
      url.searchParams.set('serverId', serverId);
    }

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
   * ES: Obtiene un backup específico por ID
   * EN: Gets a specific backup by ID
   */
  async getBackupById(id: string): Promise<Backup> {
    const response = await fetch(`${this.baseUrl}/v1/backups/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
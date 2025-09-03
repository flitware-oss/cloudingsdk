import { Auth } from './auth';
import { 
  PaginationParams, 
  Firewall, 
  FirewallsResponse, 
  CreateFirewallRequest, 
  UpdateFirewallRequest,
  CreateFirewallRuleRequest,
  FirewallRuleResponse,
  CreateFirewallRuleResponse
} from './types';

/**
 * ES: Clase para manejar operaciones de firewalls
 * EN: Class to handle firewalls operations
 */
export class Firewalls {
  private readonly auth: Auth;
  private readonly baseUrl: string;

  constructor(auth: Auth, baseUrl: string) {
    this.auth = auth;
    this.baseUrl = baseUrl;
  }

  /**
   * ES: Lista todos los firewalls
   * EN: Lists all firewalls
   */
  async getFirewalls(params: PaginationParams = {}): Promise<FirewallsResponse> {
    const { page = 1, pageSize = 20 } = params;
    const url = new URL(`${this.baseUrl}/v1/firewalls`);
    
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
   * ES: Crea un nuevo firewall
   * EN: Creates a new firewall
   */
  async createFirewall(data: CreateFirewallRequest): Promise<Firewall> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls`, {
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
   * ES: Obtiene un firewall específico por ID
   * EN: Gets a specific firewall by ID
   */
  async getFirewallById(id: string): Promise<Firewall> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Actualiza un firewall
   * EN: Updates a firewall
   */
  async updateFirewall(id: string, data: UpdateFirewallRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/${id}`, {
      method: 'PATCH',
      headers: { ...this.auth.getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Elimina un firewall
   * EN: Deletes a firewall
   */
  async deleteFirewall(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/${id}`, {
      method: 'DELETE',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Obtiene una regla de firewall por ID
   * EN: Gets a firewall rule by ID
   */
  async getFirewallRuleById(id: string): Promise<FirewallRuleResponse> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/rules/${id}`, {
      method: 'GET',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ES: Crea una nueva regla de firewall
   * EN: Creates a new firewall rule
   */
  async createFirewallRule(firewallId: string, data: CreateFirewallRuleRequest): Promise<CreateFirewallRuleResponse> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/${firewallId}/rules`, {
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
   * ES: Habilita una regla de firewall
   * EN: Enables a firewall rule
   */
  async enableFirewallRule(ruleId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/rules/${ruleId}/enable`, {
      method: 'POST',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Deshabilita una regla de firewall
   * EN: Disables a firewall rule
   */
  async disableFirewallRule(ruleId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/rules/${ruleId}/disable`, {
      method: 'POST',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ES: Elimina una regla de firewall
   * EN: Deletes a firewall rule
   */
  async deleteFirewallRule(ruleId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/firewalls/rules/${ruleId}`, {
      method: 'DELETE',
      headers: this.auth.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}
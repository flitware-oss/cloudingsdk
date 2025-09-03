/**
 * ES: Clase para manejar autenticación con API key
 * EN: Class to handle API key authentication
 */
export class Auth {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * ES: Obtiene los headers de autenticación
   * EN: Gets authentication headers
   */
  getHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'X-API-KEY': this.apiKey
    };
  }
}
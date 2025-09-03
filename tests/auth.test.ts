import { Auth } from '../src/auth';

describe('Auth', () => {
  let auth: Auth;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    auth = new Auth(mockApiKey);
  });

  describe('constructor', () => {
    it('should create Auth instance with API key', () => {
      expect(auth).toBeInstanceOf(Auth);
    });
  });

  describe('getHeaders', () => {
    it('should return correct authentication headers', () => {
      const headers = auth.getHeaders();
      
      expect(headers).toEqual({
        'Accept': 'application/json',
        'X-API-KEY': mockApiKey
      });
    });
  });
});
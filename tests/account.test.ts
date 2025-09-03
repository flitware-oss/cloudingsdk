import { Account } from '../src/account';
import { Auth } from '../src/auth';

// Mock fetch globally
global.fetch = jest.fn();

describe('Account', () => {
  let account: Account;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    account = new Account(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getLimits', () => {
    it('should fetch limits with default pagination', async () => {
      const mockResponse = {
        values: [{ name: 'server', limit: 10, usage: 5, description: 'Server limit' }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await account.getLimits();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/account/limits?page=1&pageSize=20',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch limits with custom pagination', async () => {
      const mockResponse = {
        values: [],
        links: { next: null, previous: null },
        meta: { total: 0 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await account.getLimits({ page: 2, pageSize: 10 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/account/limits?page=2&pageSize=10',
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(account.getLimits()).rejects.toThrow('HTTP 404: Not Found');
    });
  });

  describe('getLimitByName', () => {
    it('should fetch specific limit by name', async () => {
      const mockLimit = { name: 'server', limit: 10, usage: 5, description: 'Server limit' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLimit
      });

      const result = await account.getLimitByName('server');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/account/limits/server',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockLimit);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(account.getLimitByName('invalid')).rejects.toThrow('HTTP 404: Not Found');
    });
  });
});
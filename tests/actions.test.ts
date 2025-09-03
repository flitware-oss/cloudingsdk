import { Actions } from '../src/actions';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('Actions', () => {
  let actions: Actions;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    actions = new Actions(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getActions', () => {
    it('should fetch actions with default pagination', async () => {
      const mockResponse = {
        actions: [{ id: '1', status: 'completed', type: 'create', startedAt: '2023-01-01', completedAt: '2023-01-01', resourceId: 'res1', resourceType: 'server' }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await actions.getActions();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/actions?page=1&pageSize=20',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch actions with custom pagination', async () => {
      const mockResponse = {
        actions: [],
        links: { next: null, previous: null },
        meta: { total: 0 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await actions.getActions({ page: 3, pageSize: 5 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/actions?page=3&pageSize=5',
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(actions.getActions()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('getActionById', () => {
    it('should fetch specific action by ID', async () => {
      const mockAction = { id: '1', status: 'completed', type: 'create', startedAt: '2023-01-01', completedAt: '2023-01-01', resourceId: 'res1', resourceType: 'server' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAction
      });

      const result = await actions.getActionById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/actions/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockAction);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(actions.getActionById('invalid')).rejects.toThrow('HTTP 404: Not Found');
    });
  });
});
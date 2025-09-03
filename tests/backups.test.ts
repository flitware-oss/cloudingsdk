import { Backups } from '../src/backups';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('Backups', () => {
  let backups: Backups;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    backups = new Backups(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getBackups', () => {
    it('should fetch backups with default parameters', async () => {
      const mockResponse = {
        backups: [{ id: '1', createdAt: '2023-01-01', serverId: 'srv1', serverName: 'test', volumeSizeGb: 25, image: { id: 'img1', name: 'Ubuntu', accessMethods: {} } }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await backups.getBackups();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/backups?page=1&pageSize=20',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch backups with serverId filter', async () => {
      const mockResponse = {
        backups: [],
        links: { next: null, previous: null },
        meta: { total: 0 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await backups.getBackups({ serverId: 'srv123', page: 2, pageSize: 10 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/backups?page=2&pageSize=10&serverId=srv123',
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(backups.getBackups()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('getBackupById', () => {
    it('should fetch specific backup by ID', async () => {
      const mockBackup = { id: '1', createdAt: '2023-01-01', serverId: 'srv1', serverName: 'test', volumeSizeGb: 25, image: { id: 'img1', name: 'Ubuntu', accessMethods: {} } };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBackup
      });

      const result = await backups.getBackupById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/backups/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockBackup);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(backups.getBackupById('invalid')).rejects.toThrow('HTTP 404: Not Found');
    });
  });
});
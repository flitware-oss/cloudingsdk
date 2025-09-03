import { Servers } from '../src/servers';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('Servers', () => {
  let servers: Servers;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    servers = new Servers(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getServers', () => {
    it('should fetch servers with default pagination', async () => {
      const mockResponse = {
        servers: [{ id: '1', name: 'test-server', hostname: 'test.com', vCores: 1, ramGb: 2, flavor: '1x2', volumeSizeGb: 25, image: { id: 'img1', name: 'Ubuntu' }, status: 'Active' }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await servers.getServers();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/servers?page=1&pageSize=20',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(servers.getServers()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('createServer', () => {
    it('should create a new server', async () => {
      const mockServer = { id: '1', name: 'test-server', hostname: 'test.com', vCores: 1, ramGb: 2, flavor: '1x2', volumeSizeGb: 25, image: { id: 'img1', name: 'Ubuntu' }, status: 'Spawning' };
      const createData = {
        name: 'test-server',
        hostname: 'test.com',
        flavorId: '1x2',
        accessConfiguration: { sshKeyId: 'key1', password: null, savePassword: false },
        volume: { source: 'image', id: 'img1', ssdGb: 25 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockServer
      });

      const result = await servers.createServer(createData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/servers',
        {
          method: 'POST',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(createData)
        }
      );
      expect(result).toEqual(mockServer);
    });
  });

  describe('getServerById', () => {
    it('should fetch specific server by ID', async () => {
      const mockServer = { id: '1', name: 'test-server', hostname: 'test.com', vCores: 1, ramGb: 2, flavor: '1x2', volumeSizeGb: 25, image: { id: 'img1', name: 'Ubuntu' }, status: 'Active' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockServer
      });

      const result = await servers.getServerById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/servers/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockServer);
    });
  });

  describe('deleteServer', () => {
    it('should delete a server', async () => {
      const mockAction = { id: 'action1', status: 'inProgress', type: 'delete', startedAt: '2023-01-01', completedAt: null, resourceId: '1', resourceType: 'server' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAction
      });

      const result = await servers.deleteServer('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/servers/1',
        {
          method: 'DELETE',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockAction);
    });
  });

  describe('reinstallServer', () => {
    it('should reinstall a server', async () => {
      const mockServer = { id: '1', name: 'reinstalled-server', hostname: 'test.com', vCores: 2, ramGb: 4, flavor: '2x4', volumeSizeGb: 50, image: { id: 'img2', name: 'Ubuntu 22' }, status: 'Spawning' };
      const reinstallData = {
        name: 'reinstalled-server',
        hostname: 'test.com',
        flavorId: '2x4',
        accessConfiguration: { sshKeyId: 'key2', password: null, savePassword: false },
        volume: { source: 'image', id: 'img2', ssdGb: 50 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockServer
      });

      const result = await servers.reinstallServer('1', reinstallData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/servers/1/reinstall',
        {
          method: 'POST',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(reinstallData)
        }
      );
      expect(result).toEqual(mockServer);
    });
  });
});
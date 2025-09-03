import { VPCs } from '../src/vpcs';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('VPCs', () => {
  let vpcs: VPCs;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    vpcs = new VPCs(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getVPCs', () => {
    it('should fetch VPCs with default pagination', async () => {
      const mockResponse = {
        vpcs: [{ id: '1', name: 'test-vpc', description: 'test', subnetCidr: '10.0.0.0/16', dnsNameservers: ['8.8.8.8'], gatewayIp: null, totalIps: 256, availableIps: 254, isDefault: false, createdAt: '2023-01-01', ports: [] }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await vpcs.getVPCs();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/vpcs?page=1&pageSize=20',
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

      await expect(vpcs.getVPCs()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('createVPC', () => {
    it('should create a new VPC', async () => {
      const mockVPC = { id: '1', name: 'test-vpc', description: 'test', subnetCidr: '10.0.0.0/16', dnsNameservers: ['8.8.8.8'], gatewayIp: null, totalIps: 256, availableIps: 254, isDefault: false, createdAt: '2023-01-01', ports: [] };
      const createData = { name: 'test-vpc', description: 'test', subnetCidr: '10.0.0.0/16', dnsNameservers: ['8.8.8.8'] };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVPC
      });

      const result = await vpcs.createVPC(createData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/vpcs',
        {
          method: 'POST',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(createData)
        }
      );
      expect(result).toEqual(mockVPC);
    });
  });

  describe('getVPCById', () => {
    it('should fetch specific VPC by ID', async () => {
      const mockVPC = { id: '1', name: 'test-vpc', description: 'test', subnetCidr: '10.0.0.0/16', dnsNameservers: ['8.8.8.8'], gatewayIp: null, totalIps: 256, availableIps: 254, isDefault: false, createdAt: '2023-01-01', ports: [] };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVPC
      });

      const result = await vpcs.getVPCById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/vpcs/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockVPC);
    });
  });

  describe('updateVPC', () => {
    it('should update a VPC', async () => {
      const updateData = { name: 'updated-vpc', description: 'updated', dnsNameservers: ['1.1.1.1'] };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await vpcs.updateVPC('1', updateData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/vpcs/1',
        {
          method: 'PATCH',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        }
      );
    });
  });

  describe('deleteVPC', () => {
    it('should delete a VPC', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await vpcs.deleteVPC('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/vpcs/1',
        {
          method: 'DELETE',
          headers: mockAuth.getHeaders()
        }
      );
    });
  });

  describe('setVPCAsDefault', () => {
    it('should set VPC as default', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await vpcs.setVPCAsDefault('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/vpcs/1/set-default',
        {
          method: 'POST',
          headers: mockAuth.getHeaders()
        }
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(vpcs.setVPCAsDefault('1')).rejects.toThrow('HTTP 400: Bad Request');
    });
  });
});
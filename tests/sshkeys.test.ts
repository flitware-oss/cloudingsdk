import { SSHKeys } from '../src/sshkeys';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('SSHKeys', () => {
  let sshKeys: SSHKeys;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    sshKeys = new SSHKeys(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getSSHKeys', () => {
    it('should fetch SSH keys with default pagination', async () => {
      const mockResponse = {
        values: [{ id: '1', name: 'test-key', fingerprint: 'aa:bb:cc', publicKey: 'ssh-rsa AAAAB3...', hasPrivateKey: false }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await sshKeys.getSSHKeys();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/keypairs?page=1&pageSize=20',
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

      await expect(sshKeys.getSSHKeys()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('createSSHKey', () => {
    it('should create a new SSH key', async () => {
      const mockSSHKey = { id: '1', name: 'test-key', fingerprint: 'aa:bb:cc', publicKey: 'ssh-rsa AAAAB3...', hasPrivateKey: false };
      const createData = { name: 'test-key', publicKey: 'ssh-rsa AAAAB3...', privateKey: null };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSSHKey
      });

      const result = await sshKeys.createSSHKey(createData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/keypairs',
        {
          method: 'POST',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(createData)
        }
      );
      expect(result).toEqual(mockSSHKey);
    });
  });

  describe('getSSHKeyById', () => {
    it('should fetch specific SSH key by ID', async () => {
      const mockSSHKey = { id: '1', name: 'test-key', fingerprint: 'aa:bb:cc', publicKey: 'ssh-rsa AAAAB3...', hasPrivateKey: false };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSSHKey
      });

      const result = await sshKeys.getSSHKeyById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/keypairs/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockSSHKey);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(sshKeys.getSSHKeyById('invalid')).rejects.toThrow('HTTP 404: Not Found');
    });
  });

  describe('deleteSSHKey', () => {
    it('should delete an SSH key', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await sshKeys.deleteSSHKey('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/keypairs/1',
        {
          method: 'DELETE',
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

      await expect(sshKeys.deleteSSHKey('1')).rejects.toThrow('HTTP 400: Bad Request');
    });
  });

  describe('generateSSHKey', () => {
    it('should generate a new SSH key on server', async () => {
      const mockSSHKey = { id: '1', name: 'generated-key', fingerprint: 'aa:bb:cc', publicKey: 'ssh-rsa AAAAB3...', hasPrivateKey: true };
      const generateData = { name: 'generated-key' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSSHKey
      });

      const result = await sshKeys.generateSSHKey(generateData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/keypairs/generate',
        {
          method: 'POST',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(generateData)
        }
      );
      expect(result).toEqual(mockSSHKey);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(sshKeys.generateSSHKey({ name: 'test' })).rejects.toThrow('HTTP 400: Bad Request');
    });
  });
});
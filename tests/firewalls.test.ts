import { Firewalls } from '../src/firewalls';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('Firewalls', () => {
  let firewalls: Firewalls;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    firewalls = new Firewalls(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getFirewalls', () => {
    it('should fetch firewalls with default pagination', async () => {
      const mockResponse = {
        values: [{ id: '1', name: 'test', description: 'test fw', rules: [], attachments: [] }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await firewalls.getFirewalls();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls?page=1&pageSize=20',
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

      await expect(firewalls.getFirewalls()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('createFirewall', () => {
    it('should create a new firewall', async () => {
      const mockFirewall = { id: '1', name: 'test', description: 'test fw', rules: [], attachments: [] };
      const createData = { name: 'test', description: 'test fw' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFirewall
      });

      const result = await firewalls.createFirewall(createData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls',
        {
          method: 'POST',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(createData)
        }
      );
      expect(result).toEqual(mockFirewall);
    });
  });

  describe('getFirewallById', () => {
    it('should fetch specific firewall by ID', async () => {
      const mockFirewall = { id: '1', name: 'test', description: 'test fw', rules: [], attachments: [] };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFirewall
      });

      const result = await firewalls.getFirewallById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockFirewall);
    });
  });

  describe('updateFirewall', () => {
    it('should update a firewall', async () => {
      const updateData = { newName: 'updated', newDescription: 'updated desc' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await firewalls.updateFirewall('1', updateData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/1',
        {
          method: 'PATCH',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        }
      );
    });
  });

  describe('deleteFirewall', () => {
    it('should delete a firewall', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await firewalls.deleteFirewall('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/1',
        {
          method: 'DELETE',
          headers: mockAuth.getHeaders()
        }
      );
    });
  });

  describe('getFirewallRuleById', () => {
    it('should fetch firewall rule by ID', async () => {
      const mockRule = { firewallRule: { id: '1', description: 'test', protocol: 'tcp', portRangeMin: 80, portRangeMax: 80, sourceIp: '0.0.0.0/0', enabled: true }, firewallId: 'fw1' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRule
      });

      const result = await firewalls.getFirewallRuleById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/rules/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockRule);
    });
  });

  describe('createFirewallRule', () => {
    it('should create a firewall rule', async () => {
      const mockResponse = { id: 'rule1' };
      const ruleData = { sourceIp: '0.0.0.0/0', protocol: 'tcp', description: 'test', portRangeMin: 80, portRangeMax: 80 };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await firewalls.createFirewallRule('fw1', ruleData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/fw1/rules',
        {
          method: 'POST',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(ruleData)
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('enableFirewallRule', () => {
    it('should enable a firewall rule', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await firewalls.enableFirewallRule('rule1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/rules/rule1/enable',
        {
          method: 'POST',
          headers: mockAuth.getHeaders()
        }
      );
    });
  });

  describe('disableFirewallRule', () => {
    it('should disable a firewall rule', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await firewalls.disableFirewallRule('rule1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/rules/rule1/disable',
        {
          method: 'POST',
          headers: mockAuth.getHeaders()
        }
      );
    });
  });

  describe('deleteFirewallRule', () => {
    it('should delete a firewall rule', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await firewalls.deleteFirewallRule('rule1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/firewalls/rules/rule1',
        {
          method: 'DELETE',
          headers: mockAuth.getHeaders()
        }
      );
    });
  });
});
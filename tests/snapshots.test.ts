import { Snapshots } from '../src/snapshots';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('Snapshots', () => {
  let snapshots: Snapshots;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    snapshots = new Snapshots(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getSnapshots', () => {
    it('should fetch snapshots with default pagination', async () => {
      const mockResponse = {
        snapshots: [{ id: '1', sizeGb: 25, name: 'test-snapshot', description: 'test', createdAt: '2023-01-01', sourceServerName: 'server1', image: { id: 'img1', name: 'Ubuntu', accessMethods: {} }, cost: { pricePerHour: '0.01', pricePerMonthApprox: '7.30' } }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await snapshots.getSnapshots();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/snapshots?page=1&pageSize=20',
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

      await expect(snapshots.getSnapshots()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('getSnapshotById', () => {
    it('should fetch specific snapshot by ID', async () => {
      const mockSnapshot = { id: '1', sizeGb: 25, name: 'test-snapshot', description: 'test', createdAt: '2023-01-01', sourceServerName: 'server1', image: { id: 'img1', name: 'Ubuntu', accessMethods: {} }, cost: { pricePerHour: '0.01', pricePerMonthApprox: '7.30' } };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSnapshot
      });

      const result = await snapshots.getSnapshotById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/snapshots/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockSnapshot);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(snapshots.getSnapshotById('invalid')).rejects.toThrow('HTTP 404: Not Found');
    });
  });

  describe('updateSnapshot', () => {
    it('should update a snapshot', async () => {
      const updateData = { name: 'updated-snapshot', description: 'updated description' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await snapshots.updateSnapshot('1', updateData);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/snapshots/1',
        {
          method: 'PATCH',
          headers: { ...mockAuth.getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        }
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      await expect(snapshots.updateSnapshot('1', { name: 'test' })).rejects.toThrow('HTTP 400: Bad Request');
    });
  });

  describe('deleteSnapshot', () => {
    it('should delete a snapshot', async () => {
      const mockAction = { id: 'action1', status: 'inProgress', type: 'delete', startedAt: '2023-01-01', completedAt: null, resourceId: '1', resourceType: 'snapshot' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAction
      });

      const result = await snapshots.deleteSnapshot('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/snapshots/1',
        {
          method: 'DELETE',
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

      await expect(snapshots.deleteSnapshot('invalid')).rejects.toThrow('HTTP 404: Not Found');
    });
  });
});
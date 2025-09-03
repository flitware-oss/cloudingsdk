import { Sizes } from '../src/sizes';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('Sizes', () => {
  let sizes: Sizes;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    sizes = new Sizes(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getFlavors', () => {
    it('should fetch flavors with default pagination', async () => {
      const mockResponse = {
        flavors: [{}],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await sizes.getFlavors();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/sizes/flavors?page=1&pageSize=20',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch flavors with custom pagination', async () => {
      const mockResponse = {
        flavors: [],
        links: { next: null, previous: null },
        meta: { total: 0 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await sizes.getFlavors({ page: 2, pageSize: 10 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/sizes/flavors?page=2&pageSize=10',
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(sizes.getFlavors()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('getVolumeSizes', () => {
    it('should fetch volume sizes with default pagination', async () => {
      const mockResponse = {
        volumeSizes: [{}],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await sizes.getVolumeSizes();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/sizes/volumes?page=1&pageSize=20',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch volume sizes with custom pagination', async () => {
      const mockResponse = {
        volumeSizes: [],
        links: { next: null, previous: null },
        meta: { total: 0 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await sizes.getVolumeSizes({ page: 3, pageSize: 5 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/sizes/volumes?page=3&pageSize=5',
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(sizes.getVolumeSizes()).rejects.toThrow('HTTP 404: Not Found');
    });
  });
});
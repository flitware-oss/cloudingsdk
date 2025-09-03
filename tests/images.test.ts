import { Images } from '../src/images';
import { Auth } from '../src/auth';

global.fetch = jest.fn();

describe('Images', () => {
  let images: Images;
  let mockAuth: Auth;
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    mockAuth = new Auth('test-key');
    images = new Images(mockAuth, baseUrl);
    jest.clearAllMocks();
  });

  describe('getImages', () => {
    it('should fetch images with default pagination', async () => {
      const mockResponse = {
        images: [{ id: '1', name: 'Ubuntu', minimumSizeGb: 25, accessMethods: { sshKey: 'required', password: 'not-supported' }, pricePerHour: '0.01', pricePerMonthApprox: '7.30', billingUnit: 'Core' }],
        links: { next: null, previous: null },
        meta: { total: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await images.getImages();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/images?page=1&pageSize=20',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch images with custom pagination', async () => {
      const mockResponse = {
        images: [],
        links: { next: null, previous: null },
        meta: { total: 0 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await images.getImages({ page: 2, pageSize: 10 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/images?page=2&pageSize=10',
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(images.getImages()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('getImageById', () => {
    it('should fetch specific image by ID', async () => {
      const mockImage = { id: '1', name: 'Ubuntu', minimumSizeGb: 25, accessMethods: { sshKey: 'required', password: 'not-supported' }, pricePerHour: '0.01', pricePerMonthApprox: '7.30', billingUnit: 'Core' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockImage
      });

      const result = await images.getImageById('1');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/images/1',
        {
          method: 'GET',
          headers: mockAuth.getHeaders()
        }
      );
      expect(result).toEqual(mockImage);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(images.getImageById('invalid')).rejects.toThrow('HTTP 404: Not Found');
    });
  });
});
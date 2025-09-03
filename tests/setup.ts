// Mock fetch globally for all tests
Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true,
});

// Mock URL constructor
Object.defineProperty(global, 'URL', {
  value: class URL {
    searchParams: URLSearchParams;
    
    constructor(public href: string) {
      this.searchParams = new URLSearchParams();
    }
    
    toString() {
      const params = this.searchParams.toString();
      return params ? `${this.href}?${params}` : this.href;
    }
  },
  writable: true,
});

// Mock URLSearchParams
Object.defineProperty(global, 'URLSearchParams', {
  value: class URLSearchParams {
    private params: Map<string, string> = new Map();
    
    set(key: string, value: string) {
      this.params.set(key, value);
    }
    
    toString() {
      return Array.from(this.params.entries())
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    }
  },
  writable: true,
});
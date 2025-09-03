# CloudingSDK

[![npm version](https://badge.fury.io/js/cloudingsdk.svg)](https://badge.fury.io/js/cloudingsdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official TypeScript/JavaScript SDK for [Clouding.io](https://clouding.io) - A comprehensive cloud infrastructure management platform.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install cloudingsdk
```

```bash
yarn add cloudingsdk
```

```bash
pnpm add cloudingsdk
```

## Quick Start

```typescript
import CloudingSDK from 'cloudingsdk';

// Initialize the SDK
const clouding = new CloudingSDK('your-api-key');

// List all servers
const servers = await clouding.servers.getServers();
console.log('Servers:', servers);

// Create a new server
const newServer = await clouding.servers.createServer({
  name: 'my-server',
  hostname: 'my-server.example.com',
  flavorId: '1x2',
  accessConfiguration: {
    sshKeyId: 'your-ssh-key-id',
    password: null,
    savePassword: false
  },
  volume: {
    source: 'image',
    id: 'image-id',
    ssdGb: 25
  },
  publicPortFirewallIds: ['firewall-id']
});
```

## Authentication

The SDK uses API key authentication. You can obtain your API key from the [Clouding Portal](https://portal.clouding.io).

```typescript
// Basic initialization
const clouding = new CloudingSDK('your-api-key');

// Custom base URL (optional)
const clouding = new CloudingSDK('your-api-key', 'https://api.clouding.io');

// Access authentication headers
const headers = clouding.getAuthHeaders();
```

⚠️ **Security Note**: Never expose your API key in client-side code. Use environment variables or secure configuration management.

## API Reference

### Account Management

```typescript
// Get account limits
const limits = await clouding.account.getLimits({ page: 1, pageSize: 20 });

// Get specific limit by name
const serverLimit = await clouding.account.getLimitByName('server');
```

### Actions

```typescript
// List all actions
const actions = await clouding.actions.getActions({ page: 1, pageSize: 20 });

// Get action by ID
const action = await clouding.actions.getActionById('action-id');
```

### Backups

```typescript
// List all backups
const backups = await clouding.backups.getBackups();

// Filter backups by server
const serverBackups = await clouding.backups.getBackups({ 
  serverId: 'server-id' 
});

// Get backup by ID
const backup = await clouding.backups.getBackupById('backup-id');
```

### Firewalls

```typescript
// List firewalls
const firewalls = await clouding.firewalls.getFirewalls();

// Create firewall
const firewall = await clouding.firewalls.createFirewall({
  name: 'My Firewall',
  description: 'Web server firewall'
});

// Create firewall rule
const rule = await clouding.firewalls.createFirewallRule(firewall.id, {
  sourceIp: '0.0.0.0/0',
  protocol: 'tcp',
  description: 'Allow HTTP',
  portRangeMin: 80,
  portRangeMax: 80
});

// Enable/disable rules
await clouding.firewalls.enableFirewallRule('rule-id');
await clouding.firewalls.disableFirewallRule('rule-id');

// Delete firewall
await clouding.firewalls.deleteFirewall('firewall-id');
```

### Images

```typescript
// List available images
const images = await clouding.images.getImages();

// Get image details
const image = await clouding.images.getImageById('image-id');
console.log('Access methods:', image.accessMethods);
```

### Servers

```typescript
// List servers
const servers = await clouding.servers.getServers();

// Create server from image
const server = await clouding.servers.createServer({
  name: 'web-server',
  hostname: 'web.example.com',
  flavorId: '2x4',
  accessConfiguration: {
    sshKeyId: 'ssh-key-id',
    password: null,
    savePassword: false
  },
  volume: {
    source: 'image',
    id: 'ubuntu-20-04',
    ssdGb: 50
  },
  backupPreferences: {
    slots: 7,
    frequency: 'OneDay'
  },
  publicPortFirewallIds: ['firewall-id']
});

// Get server details
const serverDetails = await clouding.servers.getServerById('server-id');

// Reinstall server
const reinstalled = await clouding.servers.reinstallServer('server-id', {
  name: 'web-server-v2',
  hostname: 'web-v2.example.com',
  flavorId: '4x8',
  accessConfiguration: {
    sshKeyId: 'new-ssh-key-id',
    password: null,
    savePassword: false
  },
  volume: {
    source: 'image',
    id: 'ubuntu-22-04',
    ssdGb: 100
  }
});

// Delete server
const deleteAction = await clouding.servers.deleteServer('server-id');
```

### Sizes (Flavors & Volumes)

```typescript
// Get available server flavors
const flavors = await clouding.sizes.getFlavors();

// Get volume size options
const volumeSizes = await clouding.sizes.getVolumeSizes();
```

### Snapshots

```typescript
// List snapshots
const snapshots = await clouding.snapshots.getSnapshots();

// Get snapshot details
const snapshot = await clouding.snapshots.getSnapshotById('snapshot-id');

// Update snapshot
await clouding.snapshots.updateSnapshot('snapshot-id', {
  name: 'Updated Snapshot',
  description: 'Updated description'
});

// Delete snapshot
const deleteAction = await clouding.snapshots.deleteSnapshot('snapshot-id');
```

### SSH Keys

```typescript
// List SSH keys
const sshKeys = await clouding.sshKeys.getSSHKeys();

// Create SSH key
const sshKey = await clouding.sshKeys.createSSHKey({
  name: 'my-key',
  publicKey: 'ssh-rsa AAAAB3NzaC1yc2E...'
});

// Generate SSH key on server
const generatedKey = await clouding.sshKeys.generateSSHKey({
  name: 'generated-key'
});

// Delete SSH key
await clouding.sshKeys.deleteSSHKey('key-id');
```

### VPCs (Virtual Private Clouds)

```typescript
// List VPCs
const vpcs = await clouding.vpcs.getVPCs();

// Create VPC
const vpc = await clouding.vpcs.createVPC({
  name: 'Production Network',
  description: 'Main production VPC',
  subnetCidr: '10.0.0.0/16',
  dnsNameservers: ['8.8.8.8', '8.8.4.4']
});

// Update VPC
await clouding.vpcs.updateVPC('vpc-id', {
  name: 'Updated VPC Name',
  dnsNameservers: ['1.1.1.1', '1.0.0.1']
});

// Set as default VPC
await clouding.vpcs.setVPCAsDefault('vpc-id');

// Delete VPC
await clouding.vpcs.deleteVPC('vpc-id');
```

## Examples

### Complete Server Setup

```typescript
import CloudingSDK from 'cloudingsdk';

const clouding = new CloudingSDK(process.env.CLOUDING_API_KEY!);

async function setupWebServer() {
  try {
    // 1. Create SSH key
    const sshKey = await clouding.sshKeys.generateSSHKey({
      name: 'web-server-key'
    });

    // 2. Create firewall
    const firewall = await clouding.firewalls.createFirewall({
      name: 'Web Server Firewall',
      description: 'HTTP/HTTPS access'
    });

    // 3. Add firewall rules
    await clouding.firewalls.createFirewallRule(firewall.id, {
      sourceIp: '0.0.0.0/0',
      protocol: 'tcp',
      description: 'Allow HTTP',
      portRangeMin: 80,
      portRangeMax: 80
    });

    await clouding.firewalls.createFirewallRule(firewall.id, {
      sourceIp: '0.0.0.0/0',
      protocol: 'tcp',
      description: 'Allow HTTPS',
      portRangeMin: 443,
      portRangeMax: 443
    });

    // 4. Get available images
    const images = await clouding.images.getImages();
    const ubuntuImage = images.images.find(img => 
      img.name.includes('Ubuntu')
    );

    // 5. Create server
    const server = await clouding.servers.createServer({
      name: 'web-server-01',
      hostname: 'web01.example.com',
      flavorId: '2x4',
      accessConfiguration: {
        sshKeyId: sshKey.id,
        password: null,
        savePassword: false
      },
      volume: {
        source: 'image',
        id: ubuntuImage!.id,
        ssdGb: 50
      },
      backupPreferences: {
        slots: 7,
        frequency: 'OneDay'
      },
      publicPortFirewallIds: [firewall.id]
    });

    console.log('Server created:', server.id);
    console.log('SSH Key fingerprint:', sshKey.fingerprint);
    
    return server;
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
}

setupWebServer();
```

### Monitoring Server Actions

```typescript
async function monitorServerCreation(serverId: string) {
  const server = await clouding.servers.getServerById(serverId);
  
  if (server.action) {
    console.log(`Action ${server.action.id} status: ${server.action.status}`);
    
    // Poll action status
    while (server.action.status === 'inProgress') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
      
      const action = await clouding.actions.getActionById(server.action.id);
      console.log(`Action status: ${action.status}`);
      
      if (action.status === 'completed') {
        console.log('Server creation completed!');
        break;
      } else if (action.status === 'failed') {
        console.error('Server creation failed!');
        break;
      }
    }
  }
}
```

## Error Handling

The SDK throws standard JavaScript errors with descriptive messages:

```typescript
try {
  const server = await clouding.servers.getServerById('invalid-id');
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Example: "HTTP 404: Not Found"
  }
}
```

### Common Error Patterns

```typescript
// Wrapper function with retry logic
async function withRetry<T>(
  operation: () => Promise<T>, 
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const servers = await withRetry(() => clouding.servers.getServers());
```

## TypeScript Support

The SDK is built with TypeScript and provides full type definitions:

```typescript
import CloudingSDK, { 
  Server, 
  CreateServerRequest, 
  Firewall,
  SSHKey 
} from 'cloudingsdk';

const clouding = new CloudingSDK('api-key');

// Fully typed responses
const servers: Server[] = (await clouding.servers.getServers()).servers;

// Typed request objects
const serverConfig: CreateServerRequest = {
  name: 'typed-server',
  hostname: 'typed.example.com',
  flavorId: '1x2',
  accessConfiguration: {
    sshKeyId: 'key-id',
    password: null,
    savePassword: false
  },
  volume: {
    source: 'image',
    id: 'image-id',
    ssdGb: 25
  },
  publicPortFirewallIds: ['firewall-id']
};
```

## Pagination

Most list endpoints support pagination:

```typescript
// Basic pagination
const page1 = await clouding.servers.getServers({ page: 1, pageSize: 10 });
const page2 = await clouding.servers.getServers({ page: 2, pageSize: 10 });

// Iterate through all pages
async function getAllServers() {
  const allServers: Server[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await clouding.servers.getServers({ 
      page, 
      pageSize: 50 
    });
    
    allServers.push(...response.servers);
    hasMore = response.links.next !== null;
    page++;
  }
  
  return allServers;
}
```

## Environment Configuration

```typescript
// .env file
CLOUDING_API_KEY=your-api-key-here
CLOUDING_BASE_URL=https://api.clouding.io

// Application
import CloudingSDK from 'cloudingsdk';

const clouding = new CloudingSDK(
  process.env.CLOUDING_API_KEY!,
  process.env.CLOUDING_BASE_URL
);
```

## Rate Limiting

The Clouding API implements rate limiting. The SDK will throw errors for rate limit violations:

```typescript
try {
  await clouding.servers.getServers();
} catch (error) {
  if (error.message.includes('429')) {
    console.log('Rate limited. Please wait before retrying.');
    // Implement exponential backoff
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests if applicable
5. Run the build: `npm run build`
6. Submit a pull request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/cloudingsdk.git
cd cloudingsdk

# Install dependencies
npm install

# Build the project
npm run build

# Run tests (when available)
npm test
```

## API Documentation

For detailed API documentation, visit the [Clouding API Documentation](https://api.clouding.io/docs).

## Support

- **Documentation**: [Clouding Docs](https://docs.clouding.io)
- **API Reference**: [API Docs](https://api.clouding.io/docs)
- **Support Portal**: [Clouding Support](https://support.clouding.io)
- **Community**: [Clouding Community](https://community.clouding.io)

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Complete API coverage for all Clouding.io endpoints
- Full TypeScript support
- Comprehensive error handling
- Bilingual documentation (ES/EN)

---

**Made with ❤️ for the Clouding.io community**
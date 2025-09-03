import CloudingSDK from '../src/clouding';
import { Auth } from '../src/auth';
import { Account } from '../src/account';
import { Actions } from '../src/actions';
import { Backups } from '../src/backups';
import { Firewalls } from '../src/firewalls';
import { Images } from '../src/images';
import { Servers } from '../src/servers';
import { Sizes } from '../src/sizes';
import { Snapshots } from '../src/snapshots';
import { SSHKeys } from '../src/sshkeys';
import { VPCs } from '../src/vpcs';

describe('CloudingSDK', () => {
  let sdk: CloudingSDK;
  const apiKey = 'test-api-key';
  const baseUrl = 'https://api.test.com';

  beforeEach(() => {
    sdk = new CloudingSDK(apiKey, baseUrl);
  });

  describe('constructor', () => {
    it('should create SDK instance with default base URL', () => {
      const defaultSdk = new CloudingSDK(apiKey);
      expect(defaultSdk).toBeInstanceOf(CloudingSDK);
    });

    it('should create SDK instance with custom base URL', () => {
      expect(sdk).toBeInstanceOf(CloudingSDK);
    });

    it('should initialize all service classes', () => {
      expect(sdk.account).toBeInstanceOf(Account);
      expect(sdk.actions).toBeInstanceOf(Actions);
      expect(sdk.backups).toBeInstanceOf(Backups);
      expect(sdk.firewalls).toBeInstanceOf(Firewalls);
      expect(sdk.images).toBeInstanceOf(Images);
      expect(sdk.servers).toBeInstanceOf(Servers);
      expect(sdk.sizes).toBeInstanceOf(Sizes);
      expect(sdk.snapshots).toBeInstanceOf(Snapshots);
      expect(sdk.sshKeys).toBeInstanceOf(SSHKeys);
      expect(sdk.vpcs).toBeInstanceOf(VPCs);
    });
  });

  describe('getAuthHeaders', () => {
    it('should return authentication headers', () => {
      const headers = sdk.getAuthHeaders();
      
      expect(headers).toEqual({
        'Accept': 'application/json',
        'X-API-KEY': apiKey
      });
    });
  });
});
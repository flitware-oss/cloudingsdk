import { Auth } from './auth';
import { Account } from './account';
import { Actions } from './actions';
import { Backups } from './backups';
import { Firewalls } from './firewalls';
import { Images } from './images';
import { Servers } from './servers';
import { Sizes } from './sizes';
import { Snapshots } from './snapshots';
import { SSHKeys } from './sshkeys';
import { VPCs } from './vpcs';

/**
 * ES: SDK principal para clouding.io
 * EN: Main SDK for clouding.io
 */
export default class CloudingSDK {
  private readonly auth: Auth;
  private readonly baseUrl: string;
  public account: Account;
  public actions: Actions;
  public backups: Backups;
  public firewalls: Firewalls;
  public images: Images;
  public servers: Servers;
  public sizes: Sizes;
  public snapshots: Snapshots;
  public sshKeys: SSHKeys;
  public vpcs: VPCs;

  constructor(apiKey: string, baseUrl = 'https://api.clouding.io') {
    this.auth = new Auth(apiKey);
    this.baseUrl = baseUrl;
    this.account = new Account(this.auth, this.baseUrl);
    this.actions = new Actions(this.auth, this.baseUrl);
    this.backups = new Backups(this.auth, this.baseUrl);
    this.firewalls = new Firewalls(this.auth, this.baseUrl);
    this.images = new Images(this.auth, this.baseUrl);
    this.servers = new Servers(this.auth, this.baseUrl);
    this.sizes = new Sizes(this.auth, this.baseUrl);
    this.snapshots = new Snapshots(this.auth, this.baseUrl);
    this.sshKeys = new SSHKeys(this.auth, this.baseUrl);
    this.vpcs = new VPCs(this.auth, this.baseUrl);
  }

  /**
   * ES: Obtiene los headers de autenticación
   * EN: Gets authentication headers
   */
  getAuthHeaders(): Record<string, string> {
    return this.auth.getHeaders();
  }
}

export { CloudingSDK };
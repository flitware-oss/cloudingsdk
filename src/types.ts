export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  values: T[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface AccountLimit {
  name: string;
  limit: number;
  usage: number;
  description: string;
}

export interface Action {
  id: string;
  status: string;
  type: string;
  startedAt: string;
  completedAt: string | null;
  resourceId: string;
  resourceType: string;
}

export interface ActionsResponse {
  actions: Action[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface BackupImage {
  id: string;
  name: string;
  accessMethods: Record<string, any>;
}

export interface Backup {
  id: string;
  createdAt: string;
  serverId: string;
  serverName: string;
  volumeSizeGb: number;
  image: BackupImage;
}

export interface BackupsResponse {
  backups: Backup[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface BackupListParams extends PaginationParams {
  serverId?: string;
}

export interface FirewallRule {
  id: string;
  description: string;
  protocol: string;
  portRangeMin: number | null;
  portRangeMax: number | null;
  sourceIp: string;
  enabled: boolean;
}

export interface FirewallAttachment {
  // Estructura de attachment según la API
}

export interface Firewall {
  id: string;
  name: string;
  description: string;
  rules: FirewallRule[];
  attachments: FirewallAttachment[];
}

export interface FirewallsResponse {
  values: Firewall[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface CreateFirewallRequest {
  name: string;
  description: string;
}

export interface UpdateFirewallRequest {
  newName: string;
  newDescription: string;
}

export interface CreateFirewallRuleRequest {
  sourceIp: string;
  protocol: string;
  description: string;
  portRangeMin?: number | null;
  portRangeMax?: number | null;
}

export interface FirewallRuleResponse {
  firewallRule: FirewallRule;
  firewallId: string;
}

export interface CreateFirewallRuleResponse {
  id: string;
}

export interface ImageAccessMethods {
  sshKey: string;
  password: string;
}

export interface Image {
  id: string;
  name: string;
  minimumSizeGb: number;
  accessMethods: ImageAccessMethods;
  pricePerHour: string;
  pricePerMonthApprox: string;
  billingUnit: string;
}

export interface ImagesResponse {
  images: Image[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface AccessConfiguration {
  sshKeyId?: string | null;
  password?: string | null;
  savePassword: boolean;
}

export interface Volume {
  source: string;
  id: string;
  ssdGb: number;
  shutDownSource?: string | null;
}

export interface ReinstallServerVolume {
  source: string;
  id: string;
  ssdGb: number;
}

export interface BackupPreferences {
  slots: number;
  frequency: string;
}

export interface CreateServerVpc {
  // Estructura de VPC según la API
}

export interface ServerImage {
  id: string;
  name: string;
}

export interface RequestedAccessConfiguration {
  sshKeyId?: string | null;
  hasPassword: boolean;
  savePassword: boolean;
}

export interface ServerCost {
  pricePerHour: string;
  pricePerMonthApprox: string;
}

export interface ServerPort {
  // Estructura de puerto según la API
}

export interface Server {
  id: string;
  name: string;
  hostname: string;
  vCores: number;
  ramGb: number;
  flavor: string;
  volumeSizeGb: number;
  image: ServerImage;
  status: string;
  powerState?: string;
  features?: string[];
  pendingFeatures?: string[];
  createdAt?: string;
  dnsAddress?: string;
  publicIp?: string;
  publicPorts?: ServerPort[];
  privateIp?: string;
  vpcPorts?: ServerPort[];
  sshKeyId?: string;
  snapshots?: any[];
  backups?: Backup[];
  backupPreferences?: BackupPreferences | null;
  cost?: ServerCost;
  requestedAccessConfiguration?: RequestedAccessConfiguration;
  pendingPublicPortFirewalls?: any[];
  pendingVpcs?: any[];
  action?: Action;
}

export interface ServersResponse {
  servers: Server[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface CreateServerRequest {
  name: string;
  hostname: string;
  flavorId: string;
  firewallId?: string | null;
  accessConfiguration: AccessConfiguration;
  volume: Volume;
  enablePrivateNetwork?: boolean | null;
  enableStrictAntiDDoSFiltering?: boolean;
  userData?: string | null;
  backupPreferences?: BackupPreferences | null;
  vpcs?: CreateServerVpc[] | null;
  publicPortFirewallIds?: string[] | null;
}

export interface ReinstallServerRequest {
  name: string;
  hostname: string;
  flavorId: string;
  accessConfiguration: AccessConfiguration;
  volume: ReinstallServerVolume;
  userData?: string | null;
  backupPreferences?: BackupPreferences | null;
}

export interface Flavor {
  // Estructura de flavor según la API
}

export interface VolumeSize {
  // Estructura de tamaño de volumen según la API
}

export interface FlavorsResponse {
  flavors: Flavor[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface VolumeSizesResponse {
  volumeSizes: VolumeSize[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface SnapshotImage {
  id: string;
  name: string;
  accessMethods: Record<string, any>;
}

export interface SnapshotCost {
  pricePerHour: string;
  pricePerMonthApprox: string;
}

export interface Snapshot {
  id: string;
  sizeGb: number;
  name: string;
  description: string;
  createdAt: string;
  sourceServerName: string;
  image: SnapshotImage;
  cost: SnapshotCost;
}

export interface SnapshotsResponse {
  snapshots: Snapshot[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface UpdateSnapshotRequest {
  name: string;
  description?: string | null;
}

export interface SSHKey {
  id: string;
  name: string;
  fingerprint: string;
  publicKey: string;
  hasPrivateKey: boolean;
}

export interface SSHKeysResponse {
  values: SSHKey[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface CreateSSHKeyRequest {
  name: string;
  publicKey: string;
  privateKey?: string | null;
}

export interface GenerateSSHKeyRequest {
  name: string;
}

export interface VPCPort {
  // Estructura de puerto VPC según la API
}

export interface UpdateGatewayIpOptions {
  // Estructura de opciones de gateway según la API
}

export interface VPC {
  id: string;
  name: string;
  description: string;
  subnetCidr: string;
  dnsNameservers: string[] | null;
  gatewayIp: string | null;
  totalIps: number;
  availableIps: number;
  isDefault: boolean;
  createdAt: string;
  ports: VPCPort[];
}

export interface VPCsResponse {
  vpcs: VPC[];
  links: {
    next: string | null;
    previous: string | null;
  };
  meta: {
    total: number;
  };
}

export interface CreateVPCRequest {
  name: string;
  description: string;
  subnetCidr: string;
  dnsNameservers?: string[] | null;
  gatewayIp?: string | null;
}

export interface UpdateVPCRequest {
  name?: string | null;
  description?: string | null;
  dnsNameservers?: string[] | null;
  gateway?: UpdateGatewayIpOptions | null;
}
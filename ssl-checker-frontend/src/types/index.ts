export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
  message: string;
}

export interface SslCertificate {
  id?: string;
  issuer: string;
  issuerOrg: string;
  subject: string;
  serialNumber: string;
  signatureAlgorithm: string;
  keyAlgorithm: string;
  keySize: number;
  validFrom: string;
  validUntil: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'INVALID' | 'ERROR';
  grade: string;
  gradeScore: number;
  isWildcard: boolean;
  isSelfSigned: boolean;
  sanList: string[];
  chainInfo: ChainCertInfo[];
  protocolsSupported: string[];
  cipherSuites: string[];
  vulnerabilities: string[];
  hostnameVerified: boolean;
  isTrusted: boolean;
  checkedAt?: string;
}

export interface ChainCertInfo {
  subject: string;
  issuer: string;
  type: 'end-entity' | 'intermediate' | 'root';
  validFrom: string;
  validUntil: string;
  trusted: boolean;
}

export interface Domain {
  id: string;
  hostname: string;
  port: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'INVALID' | 'PENDING' | 'UNREACHABLE';
  daysUntilExpiry: number | null;
  lastChecked: string | null;
  alertDaysBefore: number;
  emailAlertsEnabled: boolean;
  notes: string | null;
  createdAt: string;
  grade: string | null;
  issuer: string | null;
  validUntil: string | null;
}

export interface DomainRequest {
  hostname: string;
  port?: number;
  notes?: string;
  alertDaysBefore?: number;
  emailAlertsEnabled?: boolean;
}

export interface DashboardStats {
  totalDomains: number;
  validDomains: number;
  expiringSoonDomains: number;
  expiredDomains: number;
  invalidDomains: number;
  unreachableDomains: number;
  expiryTimeline: ExpiryDataPoint[];
  gradeDistribution: Record<string, number>;
}

export interface ExpiryDataPoint {
  domain: string;
  daysRemaining: number;
  status: string;
}

export type DomainStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'INVALID' | 'PENDING' | 'UNREACHABLE';
export type CertGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

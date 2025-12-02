export interface LogEntry {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  content: string;
  timestamp: Date;
}

export enum CommandType {
  HELP = 'help',
  CLEAR = 'clear',
  ANALYZE = 'analyze',
  CONNECT = 'connect',
  DECRYPT = 'decrypt',
  UNKNOWN = 'unknown'
}

export interface NetworkNode {
  id: string;
  group: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface SystemData {
  time: string;
  cpu: number;
  memory: number;
  network: number;
}
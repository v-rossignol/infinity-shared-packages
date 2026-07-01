export interface Packet<T = unknown> {
  event: string;
  payload: T;
  timestamp: number;
}

export interface ErrorPacket {
  code: string;
  message: string;
  details?: unknown;
}

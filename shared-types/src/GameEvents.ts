export type GameEventName =
  | "player:join"
  | "player:leave"
  | "player:move"
  | "planet:colonize"
  | "resource:harvest"
  | "chat:message";

export interface GameEvent<T = unknown> {
  name: GameEventName;
  data: T;
  timestamp: number;
}

export interface ChatMessageEvent {
  senderId: string;
  senderName: string;
  content: string;
  channel: "global" | "system" | "planet";
}

export interface PlayerMoveEvent {
  playerId: string;
  fromSystemId: string;
  toSystemId: string;
}

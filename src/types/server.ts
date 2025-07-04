// 服务端类型定义
export interface ServerConfig {
    maxPlayers: number;
    gameMode: string;
    mapName: string;
}

export interface PlayerSession {
    userId: number;
    joinTime: number;
    isActive: boolean;
}

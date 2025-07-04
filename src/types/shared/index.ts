// 基础类型定义
export interface PlayerInfo {
    userId: number;
    displayName: string;
    level: number;
}

export interface GameState {
    gameMode: "menu" | "playing" | "paused";
    score: number;
    timeElapsed: number;
}

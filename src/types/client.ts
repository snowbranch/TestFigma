// 客户端类型定义
export interface ClientState {
    isConnected: boolean;
    latency: number;
}

export interface UIComponent {
    id: string;
    visible: boolean;
    zIndex: number;
}

// 战斗共享逻辑
export interface BattleEntity {
    id: string;
    position: Vector3;
    health: number;
}

export interface BattleComponent {
    entityId: string;
    componentType: string;
    data: unknown;
}

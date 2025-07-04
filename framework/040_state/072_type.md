
# 状态管理类型系统

## 概述

项目的状态管理类型系统基于 TypeScript 的严格类型检查，结合 Luban 配置系统和 Reflex 框架，为整个状态管理体系提供完整的类型安全保障。

## 类型定义原则

### 优先级规则

1. **优先使用 Luban 定义类型** - 配置数据相关的类型
2. **然后在 Store 里补充类型** - 业务逻辑和状态管理相关的类型

```typescript
// ✅ 优先使用Luban生成的类型
import type { PlayerLevelConfig, CurrencyType } from "types/luban/player";
import type { ItemConfig } from "types/luban/item";

// ✅ 在Store中补充业务类型
export interface PlayerState {
    // 使用Luban类型
    levelConfig: PlayerLevelConfig;
    // 补充业务状态类型
    isOnline: boolean;
    lastLoginAt: number;
}
```

## 核心类型定义

### Store类型

#### 根Store类型

```typescript
// 客户端Store类型
export type RootStore = ReturnType<
    typeof combineProducers<{
        cache: typeof cacheSlice;
        config: typeof slices.config;
        gameUI: typeof gameUISlice;
        itemSystem: typeof slices.itemSystem;
        persistent: typeof slices.persistent;
        player: typeof slices.player;
        shop: typeof slices.shop;
        uiState: typeof uiStateSlice;
    }>
>;

// 根状态类型
export type RootState = InferState<RootStore>;

// 服务端扩展Store类型
export interface ExtendedStore extends RootStore {
    loadPlayerData: (playerId: string, data: unknown) => void;
    closePlayerData: (playerId: string) => void;
}
```

#### 共享状态类型

```typescript
// shared/store/types.ts
export type SharedState = CombineStates<typeof slices>;

// 序列化状态类型
export type SerializedSharedState = SharedState;

// 状态序列化器
export const stateSerDes = {
    serialize: (state: SharedState) => state,
    deserialize: (state: SerializedSharedState) => state,
};
```

### 业务类型定义

#### 玩家相关类型

```typescript
// shared/store/player/types.ts

/** 玩家基础属性 */
export interface PlayerBaseStats {
    maxHealth: number;
    attack: number;
    defense: number;
    moveSpeed: number;
    critRate: number;
    critDamage: number;
}

/** 玩家战斗属性 */
export interface PlayerCombatStats extends PlayerBaseStats {
    health: number;
    shield: number;
    maxShield: number;
    attackSpeed: number;
    dodgeRate: number;
    lifeSteal: number;
    healthRegen: number;
    pickupRange: number;
}

/** 玩家货币 */
export interface PlayerCurrency {
    [CurrencyType.Gold]: number;
    [CurrencyType.Gem]: number;
    [CurrencyType.Crystal]: number;
}

/** 玩家等级信息 */
export interface PlayerLevelInfo {
    level: number;
    experience: number;
    experienceRequired: number;
    totalExperience: number;
}

/** 玩家进度 */
export interface PlayerProgress {
    totalKills: number;
    totalDeaths: number;
    totalGoldSpent: number;
    highestWave: number;
    playTime: number;
}

/** 完整玩家状态 */
export interface PlayerState {
    playerId: string;
    displayName: string;
    createdAt: number;
    lastLoginAt: number;
    isOnline: boolean;
    
    levelInfo: PlayerLevelInfo;
    baseStats: PlayerBaseStats;
    combatStats: PlayerCombatStats;
    currency: PlayerCurrency;
    progress: PlayerProgress;
    preferences: PlayerPreferences;
}
```


### 类型约束和验证

#### 状态约束接口

用于选择器和业务逻辑中的类型约束：

```typescript
// 确保状态包含必需的persistent属性
interface StateWithPersistent {
    persistent: {
        player: {
            baseStats: PlayerBaseStats;
            combatStats: PlayerCombatStats;
            currency: PlayerCurrency;
            displayName: string;
            isOnline: boolean;
            levelInfo: PlayerLevelInfo;
            preferences: PlayerPreferences;
            progress: PlayerProgress;
        };
    };
}

// 确保状态包含UI相关属性
interface StateWithUI extends RootState {
    uiState: UIState;
    gameUI: GameUIState;
}
```

#### 类型守卫

```typescript
// 类型守卫函数
export function isValidPlayerState(state: unknown): state is PlayerState {
    return (
        typeof state === "object" &&
        state !== undefined &&
        "playerId" in state &&
        "displayName" in state &&
        "levelInfo" in state
    );
}

export function hasPlayerData(state: RootState): state is StateWithPersistent {
    return (
        state.persistent?.player !== undefined &&
        isValidPlayerState(state.persistent.player)
    );
}
```

## 类型安全实践

### 1. 选择器类型约束

```typescript
// ✅ 使用类型约束确保选择器安全
export function selectPlayerLevel(playerId: string) {
    return (state: StateWithPersistent): number => {
        return state.persistent.player.levelInfo.level;
    };
}

// ✅ 泛型选择器
export function selectPlayerCurrencyAmount<T extends CurrencyType>(
    playerId: string, 
    currencyType: T
) {
    return (state: StateWithPersistent): number => {
        return state.persistent.player.currency[currencyType];
    };
}
```

### 2. Action参数类型

```typescript
// ✅ 严格的Action参数类型
export const playerSlice = createProducer(initialPlayerState, {
    updateCurrency: (state, currency: Partial<PlayerCurrency>) => ({
        ...state,
        currency: { ...state.currency, ...currency },
    }),
    
    spendCurrency: (
        state, 
        currencyType: keyof PlayerCurrency, 
        amount: number
    ) => {
        // 类型安全的货币操作
        const newAmount = state.currency[currencyType] - amount;
        if (newAmount < 0) return state;
        
        return {
            ...state,
            currency: {
                ...state.currency,
                [currencyType]: newAmount,
            },
        };
    },
});
```

### 3. 状态更新类型

```typescript
// 批量更新类型定义
export interface PlayerDataUpdate {
    levelInfo?: Partial<PlayerLevelInfo>;
    baseStats?: Partial<PlayerBaseStats>;
    combatStats?: Partial<PlayerCombatStats>;
    currency?: Partial<PlayerCurrency>;
    progress?: Partial<PlayerProgress>;
    preferences?: Partial<PlayerPreferences>;
}

// 类型安全的批量更新
batchUpdate: (state, updates: PlayerDataUpdate) => ({
    ...state,
    levelInfo: updates.levelInfo 
        ? { ...state.levelInfo, ...updates.levelInfo }
        : state.levelInfo,
    // 其他字段更新...
});
```

## Luban集成类型

### 配置类型使用

```typescript
// ✅ 使用Luban生成的配置类型
import type { 
    PlayerLevelConfig,
    ItemConfig,
    ShopItemConfig,
    CurrencyType,
    ItemType
} from "types/luban";

// 配置相关的状态类型
export interface ConfigState {
    playerLevels: Map<number, PlayerLevelConfig>;
    items: Map<string, ItemConfig>;
    shopItems: Map<string, ShopItemConfig>;
    isLoaded: boolean;
}
```

### 类型转换工具

```typescript
// Luban数据类型转换
export function convertLubanPlayerLevel(
    lubanConfig: PlayerLevelConfig
): PlayerLevelInfo {
    return {
        level: lubanConfig.level,
        experience: 0,
        experienceRequired: lubanConfig.requiredExp,
        totalExperience: 0,
    };
}

// Map类型处理工具
export function convertStatBonusMap(
    statBonus: Map<PlayerStatType, number> | Record<PlayerStatType, number>
): Record<PlayerStatType, number> {
    if (statBonus instanceof Map) {
        const result: Record<PlayerStatType, number> = {};
        statBonus.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
    return statBonus;
}

/**
 * 将Luban配置的Map转换为Record类型
 * @param configMap Luban生成的Map类型配置
 */
export function lubanMapToRecord<K extends string | number, V>(
    configMap: Map<K, V>
): Record<K, V> {
    const result = {} as Record<K, V>;
    configMap.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

/**
 * 安全的类型转换，带运行时检查
 * @param data 待转换数据
 * @param validator 验证函数
 */
export function safeTypeConvert<T>(
    data: unknown,
    validator: (data: unknown) => data is T
): T | undefined {
    return validator(data) ? data : undefined;
}
```

## 类型错误处理

### 常见类型问题

```typescript
// ❌ 常见错误：any类型的使用
function badSelector(state: any) {
    return state.player.level; // 失去类型安全
}

// ✅ 正确的类型约束
function goodSelector(state: StateWithPersistent): number {
    return state.persistent.player.levelInfo.level;
}

// ❌ 错误：未处理undefined情况
const playerName = state.persistent.player.displayName; // 可能undefined

// ✅ 正确：安全的可选链
const playerName = state.persistent?.player?.displayName ?? "Unknown";
```

### 类型断言使用

```typescript
// ⚠️ 必要时使用类型断言，但要谨慎
const convertedData = lubanData as unknown as Record<PlayerStatType, number>;

// ✅ 更安全的方式：使用类型守卫
if (isValidPlayerConfig(lubanData)) {
    // 现在lubanData被确认为正确类型
    const playerConfig = lubanData;
}
```

## 高级类型技巧

### 1. 联合类型和映射类型

```typescript
// 联合类型约束
type CurrencyKeys = keyof PlayerCurrency;
type StatKeys = keyof PlayerBaseStats;

// 映射类型实现类型安全的更新
type PlayerStateUpdates<T extends keyof PlayerState> = {
    [K in T]?: Partial<PlayerState[K]>;
};

// 条件类型实现智能类型推断
type ActionPayload<T extends string> = T extends "addCurrency"
    ? { currencyType: CurrencyType; amount: number }
    : T extends "updateStats"
    ? Partial<PlayerBaseStats>
    : never;
```

### 2. 泛型约束和递归类型

```typescript
// 递归类型定义
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 泛型约束确保类型安全
interface StateSelector<TState, TResult> {
    (state: TState): TResult;
}

// 高阶选择器类型
type SelectorCreator<TState, TArgs extends readonly unknown[], TResult> = (
    ...args: TArgs
) => StateSelector<TState, TResult>;
```

### 3. 品牌类型和智能类型

```typescript
// 品牌类型防止类型混淆
type PlayerId = string & { readonly __brand: "PlayerId" };
type ItemId = string & { readonly __brand: "ItemId" };
type CurrencyAmount = number & { readonly __brand: "CurrencyAmount" };

// 创建品牌类型的工具函数
function createPlayerId(id: string): PlayerId {
    return id as PlayerId;
}

function createCurrencyAmount(amount: number): CurrencyAmount {
    if (amount < 0) {
        throw new Error("Currency amount cannot be negative");
    }
    return amount as CurrencyAmount;
}

// 使用品牌类型的Action
export const playerSlice = createProducer(initialPlayerState, {
    transferCurrency: (
        state,
        fromPlayer: PlayerId,
        toPlayer: PlayerId,
        amount: CurrencyAmount,
        currencyType: CurrencyType
    ) => {
        // 类型安全的货币转账逻辑
        // ...
    },
});
```

## 性能考虑

### 类型计算优化

```typescript
// ✅ 使用工具类型减少重复计算  
type PlayerKeys = keyof PlayerState;
type PlayerCurrencyKeys = keyof PlayerCurrency;

// ✅ 预计算常用类型
type PartialPlayerState = Partial<PlayerState>;
type PlayerStateUpdate = Pick<PlayerState, "levelInfo" | "baseStats">;

// ✅ 缓存复杂类型计算
type ComplexPlayerType = DeepPartial<PlayerState> & {
    metadata: {
        lastModified: number;
        version: string;
    };
};

// ✅ 使用模板字面量类型
type EventType<T extends string> = `player:${T}`;
type PlayerEventType = EventType<"levelUp" | "currencyChange" | "statsUpdate">;
```

## 相关资源

- [Store核心架构](./071_store.md)
- [状态切片设计](./073_slice.md)
- [选择器使用指南](./074_selector.md)
- [Luban配置系统](../060_config/061_luban.md)

---

**类型系统是状态管理的基础，确保类型安全能有效预防运行时错误，提高代码质量和开发效率。**
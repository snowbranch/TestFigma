# Store 核心架构

## 概述

Store 是状态管理的核心组件，基于 Reflex 框架实现，采用 Redux 设计模式。Store 负责管理应用的所有状态数据。

## 核心概念

### Producer 模式

Producer 是 Reflex 中的状态管理单元，类似于 Redux 中的 Reducer：

```typescript
import { createProducer } from "@rbxts/reflex";

// 创建状态切片
export const playerSlice = createProducer(initialPlayerState, {
    updateLevel: (state, level: number) => ({
        ...state,
        level,
        updatedAt: os.time(),
    }),
    
    addExperience: (state, amount: number) => ({
        ...state,
        experience: state.experience + amount,
    }),
});
```

### Store 组合

使用 `combineProducers` 将多个 Producer 组合成 Store：

```typescript
import { combineProducers } from "@rbxts/reflex";

// 创建完整Store
export function createStore(): RootStore {
    const store = combineProducers({
        // 共享切片
        ...slices,
        // 客户端专用
        cache: cacheSlice,
        gameUI: gameUISlice,
        uiState: uiStateSlice,
    });
    
    // 应用中间件
    store.applyMiddleware(receiverMiddleware());
    
    return store;
}
```

## 中间件系统

### 性能分析中间件

监控状态更新性能：

```typescript
// shared/store/middleware/profiler.ts
export const profilerMiddleware: ProducerMiddleware = () => next => (action, ...args) => {
    const start = os.clock();
    const result = next(action, ...args);
    const duration = os.clock() - start;
    
    if (duration > 0.001) { // 超过1ms记录
        warn(`Slow action: ${action} took ${duration * 1000}ms`);
    }
    
    return result;
};
```

## Store 扩展

### 服务端Store扩展

服务端Store需要额外的玩家数据管理方法：

```typescript
// server/store/index.ts
export interface ExtendedStore extends RootStore {
    loadPlayerData: (playerId: string, data: unknown) => void;
    closePlayerData: (playerId: string) => void;
}

// 扩展store方法
const playerDataMap = new Map<string, unknown>();

/**
 * 加载玩家数据到Store
 * @param playerId 玩家ID
 * @param data 玩家数据
 */
store.loadPlayerData = (playerId: string, data: unknown): void => {
    playerDataMap.set(playerId, data);
    
    // 假设data包含displayName属性
    const playerData = data as { displayName: string };
    
    // 初始化持久化状态
    store.initializePlayer(playerId, playerData.displayName);
    
    // 设置在线状态
    store.setOnlineStatus(true);
};

/**
 * 清理玩家数据
 * @param playerId 玩家ID
 */
store.closePlayerData = (playerId: string): void => {
    playerDataMap.delete(playerId);
    
    // 清理持久化状态
    store.setOnlineStatus(false);
    
    // 可选：清理其他相关状态
    store.clearPlayerCache(playerId);
};
```

## 最佳实践

### 1. Store创建模式

```typescript
// ✅ 正确的Store创建模式
export function createStore(): RootStore {
    const store = combineProducers({
        ...sharedSlices,
        ...clientSpecificSlices,
    });
    
    // 按需应用中间件
    store.applyMiddleware(
        receiverMiddleware(),
        loggerMiddleware,
        profilerMiddleware,
    );
    
    return store;
}

// ❌ 错误：直接创建store实例
export const store = combineProducers({...}); // 不推荐
```

### 2. 服务层集成

```typescript
// ✅ 在Service中直接使用Producer方法
@Service()
export class PlayerService {
    constructor(private store: RootStore) {}
    
    /**
     * 增加玩家经验
     * @param playerId 玩家ID
     * @param amount 经验数量
     */
    public addExperience(playerId: string, amount: number): void {
        // 直接调用Producer方法
        this.store.addExperience(amount);
        
        // 获取当前状态进行业务逻辑判断
        const currentState = this.store.getState();
        const canLevelUp = selectCanLevelUp(playerId)(currentState);
        
        if (canLevelUp) {
            this.handleLevelUp(playerId);
        }
    }
    
    /**
     * 处理玩家升级
     * @param playerId 玩家ID
     */
    private handleLevelUp(playerId: string): void {
        this.store.levelUp(playerId);
        
        // 触发升级奖励
        this.grantLevelUpRewards(playerId);
    }
}

// ❌ 错误：使用dispatch方式
// store.dispatch("addExperience", amount); // 项目规范禁止
```

### 3. 类型安全

```typescript
// ✅ 使用严格的类型定义
export type RootStore = ReturnType<
    typeof combineProducers<{
        cache: typeof cacheSlice;
        config: typeof slices.config;
        gameUI: typeof gameUISlice;
        // ... 其他slice类型
    }>
>;

export type RootState = InferState<RootStore>;

// ✅ 类型约束接口
interface StateWithPlayer extends RootState {
    persistent: {
        player: PlayerState;
    };
}
```

## 调试工具

### 开发环境调试

```typescript
// 开发环境启用调试
if ($NODE_ENV === "development" && LOG_LEVEL === LogLevel.Verbose) {
    store.applyMiddleware(loggerMiddleware);
}
```

### 状态验证

```typescript
// 状态有效性验证
export function validateState(state: RootState): boolean {
    // 检查必需数据
    if (!state.persistent?.player) {
        warn("Missing player data in state");
        return false;
    }
    
    return true;
}
```

## 性能优化

### 1. 选择器优化

使用记忆化选择器避免不必要的重计算：

```typescript
const selectPlayerFinalStats = createSelector(
    [selectPlayerBaseStats, selectEquipmentStats],
    (baseStats, equipmentStats) => {
        return calculateFinalStats(baseStats, equipmentStats);
    }
);
```

### 2. 状态结构优化

避免深度嵌套，保持状态结构扁平化：

```typescript
// ✅ 扁平化状态结构
interface PlayerState {
    id: string;
    level: number;
    experience: number;
}

// ❌ 错误：过度嵌套
interface PlayerState {
    data: {
        progress: {
            level: {
                current: number;
            };
        };
    };
}
```

## 相关资源

- [状态切片设计](./073_slice.md)
- [选择器使用指南](./074_selector.md)
- [Store目录结构](./075_store-structure.md)
---

**Store 架构是状态管理的基础，良好的架构设计能够确保应用的可扩展性和可维护性。**
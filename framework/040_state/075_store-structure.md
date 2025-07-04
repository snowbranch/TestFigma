# Store 目录结构说明

本文档描述项目中状态管理（Store）的目录结构和组织方式。项目使用 [Reflex](https://littensy.github.io/reflex/) 作为状态管理库。

## 总体结构

项目的store分为三个层级：

```
src/
├── client/store/         # 客户端专用状态
├── server/store/         # 服务端专用状态  
└── shared/store/         # 客户端和服务端共享状态

```

每个 `store` 目录下包含若干子目录, 每个子目录对应一个 `store 模块`


## Store模块结构规范

每个store模块（如 `game-ui`）都遵循以下标准结构：

### 1. 文件组织

```
module-name/
├── index.ts              # 模块导出入口
├── types.ts              # 类型和接口定义
├── slice.ts              # Reflex状态切片
└── selectors.ts          # 状态选择器
```

如果 types/slice/selectors 内容过于复杂, 允许以文件夹的方式进行组织.

**它们对应的文档如下**

- @072_type.md
- @073_slice.md
- @074_selector.md

### 2. 复杂模块结构

当模块内容较多时，可以使用文件夹结构：

```
complex-module/
├── index.ts              # 模块导出入口
├── types/
│   ├── index.ts          # 类型导出
│   ├── base-types.ts     # 基础类型定义
│   ├── action-types.ts   # Action相关类型
│   └── state-types.ts    # 状态相关类型
├── slice/
│   ├── index.ts          # 切片导出
│   ├── actions.ts        # Action定义
│   └── initial-state.ts  # 初始状态
└── selectors/
    ├── index.ts          # 选择器导出
    ├── basic.ts          # 基础选择器
    ├── computed.ts       # 计算选择器
    └── memoized.ts       # 记忆化选择器
```

## 文件内容规范

### index.ts 导出规范

每个模块的 `index.ts` 文件应该遵循统一的导出模式：

```typescript
// shared/store/player/index.ts
export * from "./selectors";
export * from "./slice";
export * from "./types";

// 如果有默认导出，应该明确指定
export { playerSlice as default } from "./slice";
```

### types.ts 类型定义规范

类型文件应该包含完整的类型定义和初始状态：

```typescript
// shared/store/player/types.ts
import type { CurrencyType } from "types/luban/shop";

/** 玩家状态接口 */
export interface PlayerState {
    playerId: string;
    displayName: string;
    // ... 其他字段
}

/** 玩家数据更新接口 */
export interface PlayerDataUpdate {
    levelInfo?: Partial<PlayerLevelInfo>;
    // ... 其他可选更新字段
}

/** 初始玩家状态 */
export const initialPlayerState: PlayerState = {
    playerId: "",
    displayName: "",
    // ... 初始值
};

/** 货币限制配置 */
export const currencyLimits: Record<CurrencyType, { min: number; max: number }> = {
    [CurrencyType.Gold]: { min: 0, max: 999999999 },
    [CurrencyType.Gem]: { min: 0, max: 99999 },
    [CurrencyType.Crystal]: { min: 0, max: 9999 },
};
```

### slice.ts 切片定义规范

切片文件应该包含完整的状态管理逻辑：

```typescript
// shared/store/player/slice.ts
import { createProducer } from "@rbxts/reflex";
import type { PlayerState } from "./types";
import { initialPlayerState } from "./types";

/** 玩家状态管理切片 */
export const playerSlice = createProducer(initialPlayerState, {
    /**
     * 初始化玩家数据
     * @param state 当前状态
     * @param playerId 玩家ID
     * @param displayName 显示名称
     * @server
     */
    initializePlayer: (state, playerId: string, displayName: string) => ({
        ...state,
        playerId,
        displayName,
        createdAt: os.time(),
        lastLoginAt: os.time(),
        isOnline: true,
    }),
    
    // ... 其他Actions
});
```

### selectors.ts 选择器定义规范

选择器文件应该包含所有相关的状态选择器：

```typescript
// shared/store/player/selectors.ts

/** 状态类型约束 */
interface StateWithPersistent {
    persistent: {
        player: PlayerState;
    };
}

/**
 * 选择玩家等级
 * @param playerId 玩家ID
 */
export function selectPlayerLevel(playerId: string) {
    return (state: StateWithPersistent): number => {
        return state.persistent.player.levelInfo.level;
    };
}

// ... 其他选择器
```

## 模块组织最佳实践

### 1. 单一职责原则

每个模块应该只负责特定的业务领域：

```typescript
// ✅ 正确：专注于玩家数据
shared/store/player/     # 玩家基础数据和属性

// ✅ 正确：专注于物品系统
shared/store/item/       # 物品定义和管理

// ✅ 正确：专注于库存管理
shared/store/inventory/  # 库存状态和操作

// ❌ 错误：混合多个职责
shared/store/game-data/  # 包含玩家、物品、库存等多种数据
```

### 2. 依赖关系管理

模块之间的依赖应该清晰明确：

```typescript
// ✅ 正确：明确的依赖关系
// player模块 -> 独立模块
// inventory模块 -> 依赖item模块
// equipment模块 -> 依赖item和player模块

// ❌ 错误：循环依赖
// player模块 -> inventory模块 -> player模块
```

### 3. 测试文件组织

每个模块都应该包含相应的测试文件：

```
module-name/
├── __tests__/
│   ├── slice.jack.ts         # 切片逻辑测试
│   ├── selectors.jack.ts     # 选择器测试
│   └── integration.jack.ts   # 集成测试
├── index.ts
├── types.ts
├── slice.ts
└── selectors.ts
```

## 命名规范

### 1. 目录命名

- 使用 kebab-case 命名法
- 使用复数形式表示集合（如 `items`, `materials`）
- 使用单数形式表示单个实体（如 `player`, `config`）

### 2. 文件命名

- `index.ts` - 模块导出入口
- `types.ts` - 类型定义
- `slice.ts` - 状态切片
- `selectors.ts` - 状态选择器
- `*.jack.ts` - Jest测试文件

### 3. 导出命名

```typescript
// ✅ 切片使用Slice后缀
export const playerSlice = createProducer(/* ... */);
export const inventorySlice = createProducer(/* ... */);

// ✅ 选择器使用select前缀
export function selectPlayerLevel(/* ... */) { /* ... */ }
export function selectInventoryItems(/* ... */) { /* ... */ }

// ✅ 类型使用清晰的业务名称
export interface PlayerState { /* ... */ }
export interface InventoryItem { /* ... */ }
```

## 性能优化建议

### 1. 模块拆分

合理拆分模块避免单个文件过大：

```typescript
// 当player模块过大时，可以拆分为：
shared/store/player-core/      # 核心玩家数据
shared/store/player-stats/     # 玩家属性和战斗数据
shared/store/player-progress/  # 玩家进度和成就
```

### 2. 选择器优化

将计算复杂的选择器放在单独的文件中：

```typescript
shared/store/player/
├── selectors/
│   ├── index.ts          # 导出所有选择器
│   ├── basic.ts          # 基础选择器
│   ├── computed.ts       # 计算选择器
│   └── memoized.ts       # 记忆化选择器
```

### 3. 类型定义优化

将大型类型定义拆分为多个文件：

```typescript
shared/store/player/types/
├── index.ts              # 类型导出
├── player-state.ts       # 主要状态类型
├── player-actions.ts     # Action参数类型
└── player-computed.ts    # 计算属性类型
```

## 维护和升级

### 1. 版本控制

重要的状态结构变更应该有版本标记：

```typescript
// types.ts
/** 
 * 玩家状态接口 
 * @version 2.1.0
 * @since 1.0.0
 */
export interface PlayerState {
    // ... 字段定义
}
```

### 2. 迁移策略

状态结构变更时应该提供迁移工具：

```typescript
// migrations/player-state-v2.ts
export function migratePlayerStateV1ToV2(oldState: PlayerStateV1): PlayerStateV2 {
    return {
        ...oldState,
        // 新增字段的默认值
        newField: getDefaultValue(),
    };
}
```

### 3. 文档同步

确保代码变更时同步更新相关文档：

- 状态结构变更 → 更新类型文档
- 新增选择器 → 更新选择器文档
- 切片逻辑变更 → 更新切片文档

## 开发工作流

### 1. 创建新Store模块

```bash
# 1. 创建模块目录结构
mkdir -p src/shared/store/new-module/__tests__

# 2. 创建基础文件
touch src/shared/store/new-module/index.ts
touch src/shared/store/new-module/types.ts
touch src/shared/store/new-module/slice.ts
touch src/shared/store/new-module/selectors.ts
touch src/shared/store/new-module/__tests__/slice.jack.ts
touch src/shared/store/new-module/__tests__/selectors.jack.ts
```

### 2. 模块开发步骤

1. **定义类型** (`types.ts`)
   - 定义状态接口
   - 设置初始状态
   - 定义更新类型

2. **创建切片** (`slice.ts`)
   - 实现状态变更逻辑
   - 添加JSDoc注释
   - 标记边界(@server/@client)

3. **编写选择器** (`selectors.ts`)
   - 基础属性选择器
   - 计算选择器
   - 参数化选择器

4. **编写测试** (`__tests__/`)
   - 切片逻辑测试
   - 选择器测试
   - 边界情况测试

5. **集成到Store** (`index.ts`)
   - 导出模块接口
   - 添加到主Store配置

### 3. 开发辅助工具

#### 运行测试
```bash
# 运行单个模块测试
pnpm run test -- src/shared/store/player/__tests__/

# 运行所有store测试
pnpm run test -- src/shared/store

# 监听模式运行测试
pnpm run test:watch -- src/shared/store/player
```

#### 类型检查
```bash
# 检查store类型定义
pnpm run type-check src/shared/store/

# 检查整个项目类型
pnpm run type-check
```

#### 代码生成
```bash
# 生成Luban配置类型
pnpm run config:build

# 监听配置变化
pnpm run config:watch
```

### 4. 调试工具

#### Store状态查看
```typescript
// 开发环境下的Store状态调试
if ($NODE_ENV === "development") {
    // 打印当前Store状态
    console.log("Current Store State:", store.getState());
    
    // 监听状态变更
    store.subscribe((state, previousState) => {
        console.log("State Changed:", {
            previous: previousState,
            current: state,
        });
    });
}
```

#### 性能分析
```typescript
// 启用性能分析中间件
if (LOG_LEVEL === LogLevel.Verbose) {
    store.applyMiddleware(profilerMiddleware);
}
```

## 相关资源

- [状态管理系统概览](./070_state.md)
- [Store核心架构](./071_store.md)
- [状态切片设计](./073_slice.md)
- [选择器使用指南](./074_selector.md)
- [状态同步机制](./076_store-sync.md)
- [Jest测试规范](../030_ci-cd/032_jest-jack.md)

---

**良好的目录结构是项目可维护性的基础，遵循统一的组织规范能大幅提升开发效率和代码质量。**

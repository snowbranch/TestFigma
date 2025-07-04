# Slice

Slice 是状态管理的基本单元，使用 Reflex 的 `createProducer` API 创建。每个 Slice 管理应用状态的一个独立部分。

## 基本概念

### 什么是 Slice

Slice 是一个包含以下内容的状态管理单元：
- **初始状态**：定义默认数据结构
- **Actions**：修改状态的方法
- **Selectors**：访问状态的函数
- **类型定义**：确保类型安全

### Slice 与 Store 的关系

```
Store (状态容器)
  ├── Slice A (玩家数据)
  ├── Slice B (装备系统)
  └── Slice C (商店系统)
```

## 创建 Slice

### 基本结构

```typescript
// types.ts - 类型定义
export interface PlayerState {
    level: number;
    experience: number;
    currency: Map<string, number>;
}

export const initialPlayerState: PlayerState = {
    level: 1,
    experience: 0,
    currency: new Map(),
};

// slice.ts - Slice 定义
import { createProducer } from "@rbxts/reflex";
import { initialPlayerState } from "./types";

export const playerSlice = createProducer(initialPlayerState, {
    // Action: 增加经验
    addExperience: (state, amount: number) => ({
        ...state,
        experience: state.experience + amount,
    }),
    
    // Action: 升级
    levelUp: (state) => ({
        ...state,
        level: state.level + 1,
        experience: 0,
    }),
    
    // Action: 更新货币
    updateCurrency: (state, currencyType: string, amount: number) => {
        const newCurrency = new Map(state.currency);
        newCurrency.set(currencyType, amount);
        return { ...state, currency: newCurrency };
    },
});
```

### 使用 Map 的 Slice

对于频繁操作的集合数据，使用 Map 而非对象：

```typescript
// 装备系统 Slice
export interface EquipmentState {
    equipped: Map<EquipmentSlot, Equipment>;
    inventory: Map<string, Equipment>;
}

export const equipmentSlice = createProducer(initialEquipmentState, {
    // 装备物品
    equip: (state, slot: EquipmentSlot, equipment: Equipment) => {
        const newEquipped = new Map(state.equipped);
        newEquipped.set(slot, equipment);
        return { ...state, equipped: newEquipped };
    },
    
    // 批量更新库存
    updateInventory: (state, updates: Equipment[]) => {
        const newInventory = new Map(state.inventory);
        updates.forEach(item => {
            newInventory.set(item.id, item);
        });
        return { ...state, inventory: newInventory };
    },
});
```

## Slice 组织模式

### 目录结构

```
src/client/store/slices/player/
├── index.ts       # 统一导出
├── slice.ts       # Slice 定义
├── types.ts       # 类型定义
└── selectors.ts   # 选择器函数
```

### 模块化导出

```typescript
// index.ts
export * from "./slice";
export * from "./types";
export * from "./selectors";
```

## Actions 设计原则

### 1. 保持纯净

Actions 必须是纯函数，不能有副作用：

```typescript
// ✅ 正确：纯函数
addItem: (state, item: Item) => ({
    ...state,
    items: [...state.items, item],
}),

// ❌ 错误：有副作用
addItem: (state, item: Item) => {
    print("Adding item"); // 副作用！
    saveToDatabase(item); // 副作用！
    return { ...state, items: [...state.items, item] };
},
```

### 2. 不可变更新

始终返回新的状态对象：

```typescript
// ✅ 正确：创建新对象
updatePlayer: (state, updates: Partial<PlayerData>) => ({
    ...state,
    player: { ...state.player, ...updates },
}),

// ❌ 错误：直接修改
updatePlayer: (state, updates: Partial<PlayerData>) => {
    state.player = updates; // 直接修改！
    return state;
},
```

### 3. 批量操作

对于多个相关操作，提供批量 Action：

```typescript
export const inventorySlice = createProducer(initialState, {
    /**
     * 添加单个物品
     * @param state 当前状态
     * @param item 物品信息
     */
    addItem: (state, item: Item) => ({
        ...state,
        items: new Map([...state.items, [item.id, item]]),
        lastModified: os.time(),
    }),
    
    /**
     * 批量添加物品 - 性能更优
     * @param state 当前状态
     * @param items 物品数组
     */
    addItems: (state, items: Item[]) => {
        const newItems = new Map(state.items);
        items.forEach(item => newItems.set(item.id, item));
        return { 
            ...state, 
            items: newItems,
            lastModified: os.time(),
            totalItems: newItems.size(),
        };
    },
    
    /**
     * 批量更新物品属性
     * @param state 当前状态
     * @param updates 更新映射表
     */
    batchUpdateItems: (state, updates: Map<string, Partial<Item>>) => {
        const newItems = new Map(state.items);
        updates.forEach((update, itemId) => {
            const existing = newItems.get(itemId);
            if (existing) {
                newItems.set(itemId, { ...existing, ...update });
            }
        });
        return { ...state, items: newItems };
    },
});
```

## 选择器（Selectors）

选择器提供类型安全的状态访问：

```typescript
// selectors.ts
import { RootState } from "../types";

// 基础选择器
export const selectPlayerLevel = (state: RootState) => 
    state.player.level;

// 派生选择器
export const selectPlayerProgress = (state: RootState) => {
    const { level, experience } = state.player;
    const expForNextLevel = level * 100;
    return {
        level,
        experience,
        progress: experience / expForNextLevel,
    };
};

// 参数化选择器
export const selectCurrency = (state: RootState, currencyType: string) => 
    state.player.currency.get(currencyType) ?? 0;

// 记忆化选择器（使用 reselect）
export const selectExpensiveComputation = createSelector(
    [selectPlayerLevel, selectPlayerItems],
    (level, items) => {
        // 复杂计算...
        return computedValue;
    }
);
```

## 在组件中使用

### React 组件

```typescript
import { useSelector } from "@rbxts/react-reflex";
import { selectPlayerLevel, selectPlayerProgress } from "./store/selectors";

function PlayerStatus() {
    const level = useSelector(selectPlayerLevel);
    const progress = useSelector(selectPlayerProgress);
    
    return (
        <frame>
            <textlabel Text={`Level: ${level}`} />
            <textlabel Text={`Progress: ${progress.progress * 100}%`} />
        </frame>
    );
}
```

### 在服务中使用

```typescript
@Service()
export class PlayerService {
    constructor(private store: Producer<RootState>) {}
    
    public grantExperience(player: Player, amount: number) {
        // 直接调用 producer 方法
        this.store.player.addExperience(amount);
        
        // 检查是否需要升级
        const state = this.store.getState();
        if (state.player.experience >= state.player.level * 100) {
            this.store.player.levelUp();
        }
    }
}
```

## 嵌套 Slice 组合

使用 `combineProducers` 组合多个 Slice：

```typescript
// 主商店 Slice
const mainStoreSlice = combineProducers({
    items: itemsSlice,
    currencies: currenciesSlice,
    purchases: purchasesSlice,
});

// 根 Store
export const rootProducer = combineProducers({
    player: playerSlice,
    equipment: equipmentSlice,
    store: mainStoreSlice, // 嵌套组合
    ui: uiSlice,
});
```

## 最佳实践

### 1. 状态设计扁平化

```typescript
// ✅ 好的设计：扁平结构
interface State {
    users: Map<string, User>;
    posts: Map<string, Post>;
    comments: Map<string, Comment>;
}

// ❌ 避免：深度嵌套
interface State {
    users: {
        [id: string]: {
            profile: {
                details: {
                    // 太深了！
                }
            }
        }
    }
}
```

### 2. 合理划分 Slice

```typescript
// ✅ 正确：功能内聚
export const inventorySlice = createProducer(initialState, {
    addItem: ...,
    removeItem: ...,
    updateItem: ...,
});

// ❌ 错误：职责混乱
export const gameSlice = createProducer(initialState, {
    addItem: ...,        // 库存功能
    updatePlayer: ...,   // 玩家功能
    openShop: ...,       // 商店功能
    // 太多不相关的功能！
});
```

### 3. 类型约束

```typescript
// 使用 const assertion 确保类型安全
export const EQUIPMENT_SLOTS = ["head", "body", "weapon"] as const;
type EquipmentSlot = typeof EQUIPMENT_SLOTS[number];

// 使用 branded types 防止错误
type PlayerId = string & { readonly __brand: "PlayerId" };
type ItemId = string & { readonly __brand: "ItemId" };

// Action 中使用严格类型
equip: (state, playerId: PlayerId, itemId: ItemId) => {
    // 类型安全的操作
},
```

### 4. 性能优化

```typescript
// 对于大量数据操作，使用批量更新
export const inventorySlice = createProducer(initialState, {
    // 避免多次调用单个操作
    updateItems: (state, updates: Map<string, Partial<Item>>) => {
        const newItems = new Map(state.items);
        updates.forEach((update, id) => {
            const existing = newItems.get(id);
            if (existing) {
                newItems.set(id, { ...existing, ...update });
            }
        });
        return { ...state, items: newItems };
    },
});
```

## 常见模式

### 1. 加载状态管理

```typescript
interface LoadingState<T> {
    data: T | undefined;
    loading: boolean;
    error: string | undefined;
}

export const dataSlice = createProducer<LoadingState<Data>>(
    { data: undefined, loading: false, error: undefined },
    {
        startLoading: (state) => ({
            ...state,
            loading: true,
            error: undefined,
        }),
        
        loadSuccess: (state, data: Data) => ({
            ...state,
            data,
            loading: false,
            error: undefined,
        }),
        
        loadError: (state, error: string) => ({
            ...state,
            loading: false,
            error,
        }),
    }
);
```

### 2. 分页数据

```typescript
interface PaginatedState<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

export const listSlice = createProducer<PaginatedState<Item>>(
    initialPaginatedState,
    {
        loadPage: (state, page: number, items: Item[], total: number) => ({
            ...state,
            items: page === 1 ? items : [...state.items, ...items],
            page,
            total,
            hasMore: state.items.size() + items.size() < total,
        }),
    }
);
```

### 3. 表单状态

```typescript
interface FormState<T> {
    values: T;
    errors: Map<keyof T, string>;
    touched: Set<keyof T>;
    submitting: boolean;
}

export const formSlice = createProducer<FormState<FormData>>(
    initialFormState,
    {
        updateField: <K extends keyof FormData>(
            state: FormState<FormData>,
            field: K,
            value: FormData[K]
        ) => ({
            ...state,
            values: { ...state.values, [field]: value },
            touched: new Set([...state.touched, field]),
        }),
        
        setErrors: (state, errors: Map<keyof FormData, string>) => ({
            ...state,
            errors,
        }),
    }
);
```

## 测试 Slice

```typescript
describe("PlayerSlice", () => {
    it("should add experience", () => {
        const state = playerSlice.addExperience(initialPlayerState, 50);
        expect(state.experience).toBe(50);
    });
    
    it("should level up", () => {
        const state = playerSlice.levelUp({
            ...initialPlayerState,
            level: 5,
            experience: 99,
        });
        expect(state.level).toBe(6);
        expect(state.experience).toBe(0);
    });
});
```

## 注意事项

1. **不要在 Action 中调用其他 Action**
2. **避免在 Action 中进行异步操作**
3. **保持 Slice 的独立性，避免相互依赖**
4. **使用 TypeScript 的严格模式确保类型安全**
5. **对于复杂的状态更新，考虑拆分为多个简单的 Action**

## 相关文档

- [Store 配置](./071_store.md)
- [Selector 模式](./074_selector.md)
- [Store 同步机制](./076_store-sync.md)
# Store 设计指南

## 核心原则

Store 设计需要管理两类状态：
- **共享状态**：与服务端同步的业务数据
- **UI 状态**：客户端独有的界面交互状态

## 文件结构

以 [resource](./template/types/resource) 模块为例：

```
resource/
├── index.d.ts      # 主入口，组合导出
├── types.d.ts      # 共享状态类型定义
├── slices.d.ts     # 共享 Actions 定义
├── selectors.d.ts  # 共享选择器定义
├── ui.d.ts         # 客户端 UI 状态
└── CLAUDE.md       # 模块文档
```

## 最佳实践

### 1. 状态分离

```typescript
// 客户端 Store
export interface ResourceClientStore {
  shared: ResourceSharedState;  // 与服务端同步
  ui: ResourceUIState;          // 客户端独有
}

// 服务端 Store
export type ResourceServerStore = ResourceSharedState;
```

### 2. 共享状态复用 Protocol

```typescript
// types.d.ts - 直接使用 protocol 定义
import type { ResourceState } from "../../protocol/resource";
export type ResourceSharedState = ResourceState;
```

### 3. UI 状态设计

```typescript
// ui.d.ts - 管理界面交互状态
export interface ResourceUIState {
  inventory: {
    isOpen: boolean;
    selectedItemId: string | undefined;
    searchQuery: string;
    sortBy: ResourceSortType;
    filters: ResourceFilters;
  };
  operations: {
    isLoadingInventory: boolean;
    isProcessingItem: boolean;
    operationType: ResourceOperationType | undefined;
  };
}
```

### 4. Actions 命名规范

```typescript
// slices.d.ts - 共享操作
export interface ResourceSharedActions {
  addResource: (inventoryId: string, resource: ResourceInstance) => void;
  removeResource: (inventoryId: string, itemId: string, quantity?: number) => void;
  moveItem: (source: string, target: string, itemId: string) => void;
}

// ui.d.ts - UI 操作
export interface ResourceUIActions {
  toggleInventory: () => void;
  setSelectedItem: (itemId: string | undefined) => void;
  setLoadingInventory: (loading: boolean) => void;
}
```

### 5. 选择器使用 select 前缀

```typescript
// selectors.d.ts
export interface ResourceSharedSelectors {
  selectInventoryItems: (inventoryId: string) => Array<ResourceInstance>;
  selectIsInventoryFull: (inventoryId: string) => boolean;
  selectItemById: (itemId: string) => ResourceInstance | undefined;
}
```

## UI 状态分解方法

从用户交互出发，识别需要管理的状态：

| 用户交互 | UI 状态 | 位置 |
|---------|--------|------|
| 打开背包 | isOpen | ui.inventory.isOpen |
| 选中物品 | selectedItemId | ui.inventory.selectedItemId |
| 搜索物品 | searchQuery | ui.inventory.searchQuery |
| 筛选物品 | filters | ui.inventory.filters |
| 执行操作 | isProcessingItem | ui.operations.isProcessingItem |

## 注意事项

1. **不要重复定义 protocol 类型**
2. **操作方法定义在 store 层，不在 protocol 层**
3. **派生状态通过选择器计算，避免冗余存储**
4. **UI 状态应该是临时的、可重置的**

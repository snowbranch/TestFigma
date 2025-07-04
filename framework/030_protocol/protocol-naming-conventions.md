# Protocol 命名规范

## 概述

本文档定义了 Protocol 设计中的命名规范，包括 URI 路径、事件名称、类型定义和数据结构的命名约定。一致的命名规范是团队协作和代码维护的基础。

## URI 路径命名规范

### 基本规则

1. **使用 kebab-case**：所有单词小写，用短横线分隔
2. **模块前缀**：以业务模块名开头
3. **动词明确**：使用明确的动作描述
4. **RESTful 风格**：遵循 REST Protocol 设计原则

### 命名模式

```
{module}/{action}-{resource}
```

#### 示例对照

```typescript
// ✅ 推荐的命名
"shop/get-items"              // 获取商品列表
"shop/purchase-item"          // 购买商品
"shop/add-to-cart"            // 添加到购物车
"player/get-profile"          // 获取玩家资料
"player/update-profile"       // 更新玩家资料
"player/change-password"      // 修改密码
"battle/create-session"       // 创建战斗会话
"battle/join-session"         // 加入战斗会话
"guild/invite-member"         // 邀请公会成员
"guild/kick-member"           // 踢出公会成员

// ❌ 避免的命名
"getShopItems"                // 驼峰命名，非 REST 风格
"shop_purchase_item"          // 使用下划线
"shopPurchase"                // 缺少动作描述
"shop/buyItem"                // 混用驼峰命名
"shop/purchaseitem"           // 单词未分隔
"purchase-item"               // 缺少模块前缀
```

### 动词选择指导

| 动作类型 | 推荐动词 | 示例 |
|---------|---------|------|
| 获取数据 | `get` | `shop/get-items` |
| 创建资源 | `create` | `battle/create-session` |
| 更新资源 | `update` | `player/update-profile` |
| 删除资源 | `delete` | `guild/delete-member` |
| 添加关联 | `add` | `shop/add-to-cart` |
| 移除关联 | `remove` | `shop/remove-from-cart` |
| 修改状态 | `change` | `player/change-status` |
| 验证操作 | `verify` | `auth/verify-token` |
| 执行动作 | `execute` | `skill/execute-combo` |

## 事件命名规范

### 基本规则

1. **使用 kebab-case**：全小写，短横线分隔
2. **模块前缀**：以业务模块名开头
3. **状态描述**：描述发生的状态变化或事件
4. **被动语态**：使用过去式或状态形容词

### 命名模式

```
{module}/{subject}-{state-change}
```

#### 示例对照

```typescript
// ✅ 推荐的事件命名
"shop/stock-changed"          // 库存变化
"shop/item-added"             // 商品添加
"shop/promotion-started"      // 促销开始
"player/level-up"             // 玩家升级
"player/health-changed"       // 生命值变化
"player/status-updated"       // 状态更新
"battle/session-started"      // 战斗开始
"battle/session-ended"        // 战斗结束
"battle/player-joined"        // 玩家加入
"guild/member-invited"        // 成员被邀请
"guild/rank-changed"          // 等级变化

// ❌ 避免的事件命名
"stockChanged"                // 缺少模块前缀
"shop/onStockChange"          // 包含 on 前缀
"shop/stockUpdate"            // 混用驼峰命名
"shop/stock_changed"          // 使用下划线
"shop/changeStock"            // 主动语态
"shop/stockWillChange"        // 将来时态
```

### 事件状态词汇

| 状态类型 | 推荐词汇 | 示例 |
|---------|---------|------|
| 开始 | `started`, `began`, `initiated` | `battle/session-started` |
| 结束 | `ended`, `finished`, `completed` | `battle/session-ended` |
| 变化 | `changed`, `updated`, `modified` | `player/health-changed` |
| 添加 | `added`, `created`, `spawned` | `shop/item-added` |
| 移除 | `removed`, `deleted`, `destroyed` | `inventory/item-removed` |
| 成功 | `succeeded`, `completed`, `achieved` | `quest/mission-completed` |
| 失败 | `failed`, `error`, `rejected` | `payment/transaction-failed` |

## TypeScript 类型命名规范

### 接口命名

#### Protocol 接口命名

```typescript
// 请求载荷：{Action}Payload
export interface PurchaseItemPayload {
  itemId: string;
  quantity: number;
}

// 响应数据：{Action}Response
export interface PurchaseItemResponse extends ApiResponse<{
  transactionId: string;
  newBalance: number;
}> {}

// 事件载荷：{Event}Payload
export interface StockChangedPayload {
  itemId: string;
  newStock: number;
}
```

#### 数据结构命名

```typescript
// 业务实体：{Entity}
export interface ShopItem {
  id: string;
  name: string;
  price: number;
}

// 状态数据：{Module}State
export interface ShopState {
  items: ShopItem[];
  cart: CartItem[];
}

// 配置对象：{Module}Config
export interface ShopConfig {
  maxCartItems: number;
  discountRate: number;
}

// 枚举类型：{Module}{Purpose}
export enum ShopItemCategory {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  POTION = 'potion'
}
```

### 模块导出规范

```typescript
// 推荐：使用模块文件组织代码
// shop/api.ts
export interface GetItemsPayload { }
export interface GetItemsResponse { }

// shop/events.ts
export interface StockChangedPayload { }
export interface ItemAddedPayload { }

// shop/store.ts
export interface ShopState { }
export interface CartItem { }

// shop/index.ts - 统一导出
export * as api from './api';
export * as events from './events';
export * as store from './store';

// 使用时
import { api, events, store } from '@/modules/shop';
// 或者直接导入具体接口
import { GetItemsPayload, GetItemsResponse } from '@/modules/shop/api';
```

## 数据字段命名规范

### 通用字段

```typescript
// ✅ 推荐的字段命名
export interface BaseEntity {
  id: string;                    // 唯一标识符
  name: string;                  // 显示名称
  description?: string;          // 描述信息
  createdAt: number;             // 创建时间（时间戳）
  updatedAt: number;             // 更新时间（时间戳）
  isActive: boolean;             // 是否激活
  metadata?: Record<string, unknown>; // 元数据
}

// ❌ 避免的字段命名
export interface BadEntity {
  ID: string;                    // 全大写
  displayName: string;           // 不一致的命名
  desc: string;                  // 缩写不清晰
  create_time: number;           // 使用下划线
  is_active: boolean;            // 使用下划线
  meta: any;                     // 使用 any 类型
}
```

### 布尔字段

```typescript
// ✅ 推荐：使用 is/has/can 前缀
export interface PlayerState {
  isOnline: boolean;             // 是否在线
  isReady: boolean;              // 是否准备
  hasPermission: boolean;        // 是否有权限
  canTrade: boolean;             // 是否可交易
  isVisible: boolean;            // 是否可见
}

// ❌ 避免：不明确的布尔命名
export interface BadPlayerState {
  online: boolean;               // 不够明确
  ready: boolean;                // 不够明确
  permission: boolean;           // 混淆类型
  tradeable: boolean;            // 不一致的命名风格
}
```

### 数值字段

```typescript
// ✅ 推荐：明确的数值命名
export interface PlayerStats {
  health: number;                // 生命值
  maxHealth: number;             // 最大生命值
  level: number;                 // 等级
  experience: number;            // 经验值
  gold: number;                  // 金币数量
  attackPower: number;           // 攻击力
  defenseValue: number;          // 防御值
}

// ❌ 避免：不明确的数值命名
export interface BadPlayerStats {
  hp: number;                    // 缩写不清晰
  maxHp: number;                 // 命名不一致
  lvl: number;                   // 缩写
  exp: number;                   // 缩写
  money: number;                 // 语义不明确
  atk: number;                   // 缩写
  def: number;                   // 缩写
}
```

## 模块划分规范

### 核心业务模块

```typescript
// 推荐的模块文件结构
// modules/
// ├── player/              // 玩家相关
// │   ├── api.ts          // Protocol 接口定义
// │   ├── events.ts       // 事件定义
// │   ├── store.ts        // 状态定义
// │   └── index.ts        // 模块导出
// ├── shop/               // 商店相关
// │   ├── api.ts
// │   ├── events.ts
// │   ├── store.ts
// │   └── index.ts
// ├── battle/             // 战斗相关
// │   ├── api.ts
// │   ├── events.ts
// │   ├── store.ts
// │   └── index.ts
// ├── guild/              // 公会相关
// │   ├── api.ts
// │   ├── events.ts
// │   ├── store.ts
// │   └── index.ts
// ├── inventory/          // 背包相关
// │   ├── api.ts
// │   ├── events.ts
// │   ├── store.ts
// │   └── index.ts
// ├── quest/              // 任务相关
// │   ├── api.ts
// │   ├── events.ts
// │   ├── store.ts
// │   └── index.ts
// └── social/             // 社交相关
//     ├── api.ts
//     ├── events.ts
//     ├── store.ts
//     └── index.ts

// 示例：player/index.ts
export * as api from './api';
export * as events from './events';
export * as store from './store';
export * from './types'; // 导出通用类型
```

### 模块边界原则

1. **单一职责**：每个模块只负责一个业务领域
2. **低耦合**：模块之间依赖最小化
3. **高内聚**：模块内部功能紧密相关
4. **清晰边界**：模块职责边界明确
5. **文件组织**：通过文件系统天然实现模块隔离

#### 模块间通信示例

```typescript
// 不推荐：直接跨模块访问内部实现
import { internalHelper } from '@/modules/shop/helpers';

// 推荐：通过公开 Protocol 进行模块间通信
import { api as shopApi } from '@/modules/shop';
import { api as playerApi } from '@/modules/player';

// 模块间依赖关系应该明确且最小化
class PurchaseService {
  async purchaseItem(playerId: string, itemId: string) {
    // 通过公开 Protocol 调用其他模块
    const player = await playerApi.getPlayer(playerId);
    const item = await shopApi.getItem(itemId);
    // ...
  }
}
```

## 版本控制规范

### Protocol 版本命名

```typescript
// 推荐：使用目录结构管理版本
// shop/
// ├── v1/
// │   ├── api.ts
// │   └── index.ts
// ├── v2/
// │   ├── api.ts
// │   └── index.ts
// └── index.ts        // 默认导出最新版本

// shop/v1/api.ts
export interface GetItemsPayload { }

// shop/v2/api.ts
export interface GetItemsPayload {
  // 新增字段
  includeOutOfStock?: boolean;
}

// shop/index.ts - 导出最新版本作为默认
export * from './v2';
export * as v1 from './v1';
export * as v2 from './v2';

// 使用时
import { GetItemsPayload } from '@/modules/shop'; // 默认最新版本
import { v1, v2 } from '@/modules/shop'; // 指定版本
```

### 兼容性标记

```typescript
/**
 * @deprecated 使用 @/modules/shop/v2 中的 GetItemsPayload 替代
 * @since v1.0.0
 * @removed v3.0.0
 */
export interface GetItemsPayload {
  category?: string;
}

/**
 * @since v2.0.0
 */
export interface GetItemsPayloadV2 extends GetItemsPayload {
  includeOutOfStock?: boolean;
}
```

## 工具和检查

### ESLint 规则

```json
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": false
        }
      },
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      },
      {
        "selector": "enum",
        "format": ["PascalCase"]
      },
      {
        "selector": "property",
        "format": ["camelCase"]
      }
    ]
  }
}
```

### 命名检查工具

```typescript
// 自定义 lint 规则示例
const Protocol_URI_PATTERN = /^[a-z]+\/[a-z]+(-[a-z]+)*$/;
const EVENT_NAME_PATTERN = /^[a-z]+\/[a-z]+(-[a-z]+)*$/;

function validateApiUri(uri: string): boolean {
  return Protocol_URI_PATTERN.test(uri);
}

function validateEventName(name: string): boolean {
  return EVENT_NAME_PATTERN.test(name);
}
```

## 最佳实践总结

1. **一致性**：整个项目使用统一的命名规范
2. **可读性**：命名应该自解释，避免缩写
3. **可维护性**：考虑未来的扩展和修改
4. **团队协作**：确保团队成员理解并遵循规范
5. **工具支持**：使用 ESLint 等工具自动检查
6. **文档化**：将命名规范文档化并定期更新

遵循这些命名规范，可以显著提高代码的可读性、可维护性和团队协作效率。
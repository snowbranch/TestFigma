# Store 数据结构设计

## 概述

Store 数据结构设计是 Protocol First 理念中的重要组成部分。与传统的请求-响应和事件监听不同，Store 代表的是**需要在客户端和服务端之间自动同步的状态数据**。良好的 Store 设计能够简化状态管理，提高开发效率。

## Store 设计原则

### 1. 数据驱动

Store 应该包含驱动 UI 和游戏逻辑的核心数据，而不是临时计算结果。

```typescript
// ✅ 推荐：核心状态数据
export interface PlayerStore {
  profile: {
    id: string;
    name: string;
    level: number;
    experience: number;
  };
  stats: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
  };
  inventory: {
    items: InventoryItem[];
    capacity: number;
  };
}

// ❌ 避免：计算结果和临时数据
export interface BadPlayerStore {
  profile: PlayerProfile;
  healthPercentage: number;        // 应该通过计算得出
  isLowHealth: boolean;            // 应该通过计算得出
  temporaryBuffs: Buff[];          // 临时数据，不应该持久化
}
```

### 2. 规范化结构

使用规范化的数据结构，避免嵌套过深和数据重复。

```typescript
// ✅ 推荐：规范化的数据结构
export interface ShopStore {
  // 实体数据
  items: Record<string, ShopItem>;
  categories: Record<string, ItemCategory>;
  
  // 关系数据
  categoryItems: Record<string, string[]>;  // categoryId -> itemIds
  
  // 用户相关状态
  cart: {
    items: Array<{ itemId: string; quantity: number }>;
    totalPrice: number;
  };
  
  // 界面状态
  ui: {
    selectedCategoryId?: string;
    isLoading: boolean;
    lastUpdated: number;
  };
}

// ❌ 避免：非规范化和深度嵌套
export interface BadShopStore {
  categories: Array<{
    id: string;
    name: string;
    items: Array<{              // 嵌套过深
      id: string;
      name: string;
      price: number;
      category: {               // 数据重复
        id: string;
        name: string;
      };
    }>;
  }>;
}
```

### 3. 最小状态原则

只存储必要的状态，其他数据通过计算派生。

```typescript
// ✅ 推荐：最小必要状态
export interface BattleStore {
  sessionId: string;
  players: Record<string, BattlePlayer>;
  currentTurn: number;
  phase: 'preparation' | 'battle' | 'result';
  startTime: number;
  
  // 通过计算派生的数据在组件中计算
  // - isMyTurn: currentTurn === myPlayerId
  // - remainingTime: calculateRemainingTime(startTime)
  // - gameStatus: deriveGameStatus(phase, players)
}

// ❌ 避免：存储派生状态
export interface BadBattleStore {
  sessionId: string;
  players: Record<string, BattlePlayer>;
  currentTurn: number;
  phase: 'preparation' | 'battle' | 'result';
  startTime: number;
  
  // 这些都是派生数据，不应该存储
  isMyTurn: boolean;
  remainingTime: number;
  gameStatus: string;
  winnerPlayerId?: string;
}
```

## Store 数据分类

### 1. 实体数据 (Entities)

代表业务核心实体的数据。

```typescript
// 玩家实体
export interface PlayerEntity {
  id: string;
  name: string;
  level: number;
  experience: number;
  gold: number;
  createdAt: number;
  lastLoginAt: number;
}

// 物品实体
export interface ItemEntity {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  attributes: ItemAttributes;
}
```

### 2. 集合数据 (Collections)

实体的集合和索引。

```typescript
export interface InventoryStore {
  // 主要集合
  items: Record<string, InventoryItem>;
  
  // 索引集合
  itemsByType: Record<ItemType, string[]>;
  itemsByRarity: Record<ItemRarity, string[]>;
  
  // 元数据
  capacity: number;
  usedSlots: number;
  lastUpdated: number;
}
```

### 3. 关系数据 (Relations)

实体之间的关联关系。

```typescript
export interface GuildStore {
  // 实体数据
  guild: GuildInfo;
  members: Record<string, GuildMember>;
  
  // 关系数据
  membersByRank: Record<GuildRank, string[]>;
  membersByStatus: Record<MemberStatus, string[]>;
  
  // 权限关系
  permissions: Record<string, Permission[]>;  // memberId -> permissions
}
```

### 4. 状态数据 (States)

表示当前系统状态。

```typescript
export interface GameSessionStore {
  // 会话状态
  sessionId: string;
  status: 'waiting' | 'active' | 'paused' | 'ended';
  
  // 时间状态
  startTime: number;
  pausedTime?: number;
  endTime?: number;
  
  // 参与者状态
  players: Record<string, PlayerSessionState>;
  spectators: string[];
  
  // 游戏状态
  currentPhase: GamePhase;
  turnOrder: string[];
  currentTurnIndex: number;
}
```

## 按业务模块设计 Store

### 玩家模块 (Player)

```typescript
// src/types/api/player/store.d.ts

import type { PlayerAttributes, Achievement, PlayerSettings, Vector3 } from './types';

/**
 * 玩家核心状态
 */
export interface PlayerState {
  // 基础信息
  profile: PlayerProfile;
  
  // 游戏数据
  stats: PlayerStats;
  attributes: PlayerAttributes;
  
  // 进度数据
  level: LevelInfo;
  achievements: Achievement[];
  
  // 设置数据
  settings: PlayerSettings;
  
  // 状态标识
  status: 'online' | 'offline' | 'away' | 'busy';
  location: {
    scene: string;
    position?: Vector3;
  };
  
  // 同步信息
  lastSyncTime: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  joinDate: number;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  energy: number;
  maxEnergy: number;
}

export interface LevelInfo {
  current: number;
  experience: number;
  experienceToNext: number;
  totalExperience: number;
}
```

### 商店模块 (Shop)

```typescript
// src/types/api/shop/store.d.ts

import type { ShopItem, ItemCategory, PurchaseRecord, OpenHours, ShopFilters, Discount, PromotionCondition } from './types';

/**
 * 商店状态
 */
export interface ShopState {
  // 商品数据
  items: Record<string, ShopItem>;
  categories: Record<string, ItemCategory>;
  
  // 分类关系
  categoryItems: Record<string, string[]>;
  featuredItems: string[];
  
  // 用户相关
  cart: ShoppingCart;
  favorites: string[];
  purchaseHistory: PurchaseRecord[];
  
  // 促销信息
  promotions: Record<string, Promotion>;
  activePromotions: string[];
  
  // 商店状态
  isOpen: boolean;
  openHours: OpenHours;
  lastRefreshTime: number;
  
  // UI 状态
  selectedCategoryId?: string;
  searchQuery: string;
  sortBy: 'price' | 'name' | 'popularity';
  filters: ShopFilters;
}

export interface ShoppingCart {
  items: CartItem[];
  totalPrice: number;
  totalWeight: number;
  appliedDiscounts: Discount[];
}

export interface CartItem {
  itemId: string;
  quantity: number;
  addedAt: number;
  price: number;          // 添加时的价格
}

export interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'bundle' | 'free_shipping';
  value: number;
  conditions: PromotionCondition[];
  startTime: number;
  endTime: number;
  isActive: boolean;
}
```

### 战斗模块 (Battle)

```typescript
// src/types/api/battle/store.d.ts

import type { BattleType, GameMode, Team, BattlePhase, BattleMap, WeatherCondition, BattleAction, BattleEvent, BattleResult, Vector3, EquipmentSet } from './types';

/**
 * 战斗会话状态
 */
export interface BattleState {
  // 会话基础信息
  sessionId: string;
  battleType: BattleType;
  gameMode: GameMode;
  
  // 参与者
  players: Record<string, BattlePlayer>;
  teams: Record<string, Team>;
  spectators: string[];
  
  // 游戏状态
  phase: BattlePhase;
  round: number;
  turn: number;
  currentPlayer?: string;
  
  // 时间管理
  startTime: number;
  turnStartTime: number;
  turnTimeLimit: number;
  
  // 地图和环境
  map: BattleMap;
  weather?: WeatherCondition;
  
  // 战斗历史
  actions: BattleAction[];
  events: BattleEvent[];
  
  // 结果数据
  result?: BattleResult;
}

export interface BattlePlayer {
  playerId: string;
  teamId: string;
  position: Vector3;
  status: 'alive' | 'defeated' | 'disconnected';
  
  // 战斗属性
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  
  // 装备和技能
  equipment: EquipmentSet;
  activeSkills: string[];
  cooldowns: Record<string, number>;
  
  // 战斗统计
  stats: BattlePlayerStats;
}

export interface BattlePlayerStats {
  damageDealt: number;
  damageTaken: number;
  healsGiven: number;
  skillsUsed: number;
  kills: number;
  deaths: number;
  assists: number;
}
```

### 公会模块 (Guild)

```typescript
// src/types/api/guild/store.d.ts

import type { GuildRank, GuildRankInfo, Permission, GuildTreasury, GuildFacility, GuildEvent, WarStatus, GuildApplication, GuildInvitation, GuildActivity, MemberStatus } from './types';

/**
 * 公会状态
 */
export interface GuildState {
  // 公会基础信息
  guild: GuildInfo;
  
  // 成员数据
  members: Record<string, GuildMember>;
  membersByRank: Record<GuildRank, string[]>;
  onlineMembers: string[];
  
  // 权限系统
  ranks: Record<string, GuildRankInfo>;
  permissions: Record<string, Permission[]>;
  
  // 公会资源
  treasury: GuildTreasury;
  facilities: GuildFacility[];
  
  // 活动数据
  events: GuildEvent[];
  upcomingEvents: string[];
  
  // 战争和外交
  allies: string[];           // 盟友公会 ID
  enemies: string[];          // 敌对公会 ID
  warStatus: WarStatus[];
  
  // 申请和邀请
  applications: GuildApplication[];
  sentInvitations: GuildInvitation[];
  
  // 历史记录
  activityLog: GuildActivity[];
  
  // 同步状态
  lastUpdated: number;
}

export interface GuildInfo {
  id: string;
  name: string;
  tag: string;                // 公会标签
  description: string;
  emblem: string;             // 徽章图片
  level: number;
  experience: number;
  
  // 公会设置
  isRecruiting: boolean;
  recruitmentMessage: string;
  requiredLevel: number;
  
  // 统计信息
  totalMembers: number;
  maxMembers: number;
  foundedAt: number;
  
  // 公会排名
  ranking: {
    server: number;
    region: number;
    global: number;
  };
}

export interface GuildMember {
  playerId: string;
  playerName: string;
  rank: GuildRank;
  joinDate: number;
  lastActiveDate: number;
  contribution: number;
  
  // 成员状态
  isOnline: boolean;
  status: MemberStatus;
  
  // 权限和角色
  permissions: Permission[];
  roles: string[];
}
```

## Store 同步策略

### 1. 全量同步

适用于小型数据集，直接同步整个 Store。

```typescript
// src/types/api/player/sync.d.ts
import type { PlayerState } from './store';

export interface PlayerStoreSync {
  type: 'full';
  timestamp: number;
  data: PlayerState;
}
```

### 2. 增量同步

适用于大型数据集，只同步变化的部分。

```typescript
export interface ShopStoreSync {
  type: 'delta';
  timestamp: number;
  changes: {
    // 添加或更新的项目
    upserted?: {
      items?: Record<string, ShopItem>;
      promotions?: Record<string, Promotion>;
    };
    
    // 删除的项目
    deleted?: {
      items?: string[];
      promotions?: string[];
    };
    
    // 特定字段更新
    updated?: {
      cart?: Partial<ShoppingCart>;
      ui?: Partial<ShopState['ui']>;
    };
  };
}
```

### 3. 事件驱动同步

基于特定事件触发的同步。

```typescript
export interface BattleStoreSyncEvent {
  type: 'event';
  eventType: 'player_joined' | 'player_action' | 'phase_changed';
  timestamp: number;
  
  // 根据事件类型同步对应数据
  data: {
    playerId?: string;
    action?: BattleAction;
    newPhase?: BattlePhase;
  };
  
  // 影响的 Store 部分
  affectedPaths: string[];
}
```

## Store 性能优化

### 1. 数据分片

将大型 Store 分解为多个小的分片。

```typescript
// 分片策略
export interface InventoryStoreSharded {
  // 按页分片
  pages: Record<number, InventoryPage>;
  currentPage: number;
  totalPages: number;
  
  // 元数据
  metadata: {
    totalItems: number;
    capacity: number;
    lastUpdated: number;
  };
}

export interface InventoryPage {
  pageNumber: number;
  items: Record<string, InventoryItem>;
  itemOrder: string[];
}
```

### 2. 懒加载

按需加载数据。

```typescript
export interface GuildStoreWithLazyLoad {
  // 基础数据（立即加载）
  basic: {
    guild: GuildInfo;
    myMember: GuildMember;
  };
  
  // 延迟加载的数据
  lazy: {
    allMembers?: Record<string, GuildMember>;
    activityLog?: GuildActivity[];
    facilities?: GuildFacility[];
  };
  
  // 加载状态
  loadingStates: {
    members: 'idle' | 'loading' | 'loaded' | 'error';
    activities: 'idle' | 'loading' | 'loaded' | 'error';
    facilities: 'idle' | 'loading' | 'loaded' | 'error';
  };
}
```

### 3. 缓存策略

```typescript
export interface StoreCache<T> {
  data: T;
  
  // 缓存元数据
  cached: {
    timestamp: number;
    ttl: number;              // 生存时间（秒）
    version: string;          // 数据版本
  };
  
  // 缓存状态
  status: 'fresh' | 'stale' | 'expired' | 'loading';
}

// 使用示例
// src/types/api/shop/cache.d.ts
import type { ShopItem, Promotion } from './store';

export interface CachedShopStore {
  items: StoreCache<Record<string, ShopItem>>;
  promotions: StoreCache<Record<string, Promotion>>;
}
```

## 最佳实践

### 1. Store 边界清晰

```typescript
// ✅ 推荐：清晰的模块边界
export interface PlayerStore {
  // 只包含玩家相关的数据
  profile: PlayerProfile;
  stats: PlayerStats;
  settings: PlayerSettings;
}

export interface InventoryStore {
  // 只包含背包相关的数据
  items: Record<string, InventoryItem>;
  capacity: number;
  filters: InventoryFilters;
}

// ❌ 避免：混合不同模块的数据
export interface MixedStore {
  player: PlayerProfile;
  inventory: InventoryItem[];
  shopCart: CartItem[];        // 应该属于 ShopStore
  guildInfo: GuildInfo;        // 应该属于 GuildStore
}
```

### 2. 状态规范化

```typescript
// ✅ 推荐：规范化存储
export interface NormalizedBattleStore {
  players: Record<string, BattlePlayer>;
  teams: Record<string, Team>;
  
  // 关系映射
  teamPlayers: Record<string, string[]>;    // teamId -> playerIds
  playerTeam: Record<string, string>;       // playerId -> teamId
}

// ❌ 避免：嵌套存储
export interface DenormalizedBattleStore {
  teams: Array<{
    id: string;
    players: BattlePlayer[];    // 数据重复和嵌套
  }>;
}
```

### 3. 类型安全

```typescript
// 使用严格的类型定义
export interface TypeSafeStore {
  // 使用联合类型确保类型安全
  status: 'idle' | 'loading' | 'success' | 'error';
  
  // 使用 Record 类型确保键值类型一致
  entities: Record<string, Entity>;
  
  // 使用可选链避免 undefined 错误
  currentUser?: {
    id: string;
    preferences: UserPreferences;
  };
}
```

### 4. 文档和注释

```typescript
// src/types/api/shop/store-example.d.ts
import type { ShopItem, ShoppingCart } from './store';

/**
 * 商店模块状态管理示例
 * 
 * @description 管理商店商品、购物车、促销等状态
 * @syncStrategy 增量同步，每 30 秒检查一次更新
 * @cachePolicy 商品数据缓存 5 分钟，促销数据实时更新
 */
export interface ShopStoreExample {
  /**
   * 商品实体数据
   * @indexed 按分类和价格建立索引
   */
  items: Record<string, ShopItem>;
  
  /**
   * 用户购物车
   * @persistence 本地持久化，离线时保留
   */
  cart: ShoppingCart;
}
```

## 总结

良好的 Store 设计应该：

1. **数据驱动**：存储驱动业务逻辑的核心数据
2. **结构清晰**：使用规范化的数据结构
3. **边界明确**：按业务模块划分，避免混合
4. **性能优化**：考虑分片、缓存和懒加载
5. **类型安全**：使用 TypeScript 严格类型检查
6. **同步策略**：根据数据特点选择合适的同步方式

通过遵循这些原则，可以构建出高效、可维护的 Store 数据结构，为游戏提供稳定的状态管理基础。
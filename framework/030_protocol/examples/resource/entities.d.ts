/**
 * 资源模块共享实体定义
 */

/**
 * 资源基础信息
 */
export interface Resource {
  /** 资源唯一标识 */
  id: string;
  /** 资源名称 */
  name: string;
  /** 资源描述 */
  description: string;
  /** 资源类型 */
  type: ResourceType;
  /** 资源子类型 */
  subType?: string;
  /** 资源稀有度 */
  rarity: ResourceRarity;
  /** 是否可销毁 */
  destroyable: boolean;
  /** 是否可堆叠 */
  stackable: boolean;
  /** 最大堆叠数量 */
  maxStack: number;
}

/**
 * 资源类型
 */
export enum ResourceType {
  CURRENCY = 1,      // 货币
  ITEM = 2,          // 物品
  MATERIAL = 3,      // 材料
  EQUIPMENT = 4,     // 装备
  CONSUMABLE = 5,    // 消耗品
  PET = 6,           // 宠物
  ENERGY = 7,        // 能量
  TOKEN = 8          // 代币
}

/**
 * 资源稀有度
 */
export enum ResourceRarity {
  COMMON = 1,        // 普通
  UNCOMMON = 2,      // 非凡
  RARE = 3,          // 稀有
  EPIC = 4,          // 史诗
  LEGENDARY = 5,     // 传说
  MYTHIC = 6         // 神话
}

/**
 * 资源实例（玩家拥有的具体资源）
 */
export interface ResourceInstance {
  /** 实例ID */
  id: string;
  /** 资源ID */
  resourceId: string;
  /** 拥有数量 */
  quantity: number;
  /** 是否锁定, 锁定后无法增删改*/
  locked: boolean;
}


/**
 * 资源仓库
 */
export interface ResourceInventory extends Record<string, ResourceInstance>{
}

/**
 * 库存变化量, 已经发生
 */
export interface ResourceInventoryDelta {
  /** 仓库ID */
  inventoryId: string;
  /** 资源包 */
  resource: ResourceInstance;
  /** 方向, 正数表示增加, 负数表示减少 */
  direction?: boolean;
}

/**
 * 库存意向变化量, 还未发生
 * 描述了某操作针对库存的意图, 但还未发生
 * 比如购买商品的价格, 奖励的资源等
 */
export interface ResourceInventoryIntent {
  /** 仓库ID */
  inventoryId: string;
  /** 资源包 */
  resource: ResourceInstance;
  /** 方向, 正数表示增加, 负数表示减少 */
  direction?: boolean;
}

/**
 * 库存批量变化量
 */
export interface ResourceInventoryMultipleDelta {
  /** 仓库ID */
  inventoryId: string;
  /** 方向, 正数表示增加, 负数表示减少 */
  direction?: boolean;
  /** 奖励资源列表 */
  resources: ResourceInstance[];
}

/**
 * 资源实体
 */
export interface ResourceInstance {
  /** 资源ID */
  resourceId: string;
  /** 数量 */
  quantity: number;
}
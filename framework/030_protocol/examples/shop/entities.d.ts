/**
 * 商店模块共享实体定义
 */

import { ResourceInventoryDelta, ResourceInventoryMultipleDelta } from "../resource/entities";

/**
 * 商店信息
 */
export interface Shop {
  /** 商店唯一标识 */
  id: string;
  /** 商店名称 */
  name: string;
  /** 商店描述 */
  description: string;
  /** 商店类型 */
  type: ShopType;
  /** 商店状态 */
  status: ShopStatus;
  /** 商店配置 */
  config: ShopContext;
}

/**
 * 商店类型
 */
export enum ShopType {
  SYSTEM = 1,    // 系统商店
  PLAYER = 2,    // 玩家商店
  GUILD = 3,     // 公会商店
  SPECIAL = 4    // 特殊活动商店
}

/**
 * 商店状态
 */
export enum ShopStatus {
  OPEN = 1,      // 开放
  CLOSED = 2,    // 关闭
  MAINTENANCE = 3 // 维护中(关联营业时间)
}

/**
 * 商店配置
 */
export interface ShopContext {
  /** 刷新配置 */
  refreshOptions?: ShopRefreshOptions;

}

/**
 * 商店刷新配置
 */
export interface ShopRefreshOptions {

}

/** 手动刷新 */
export interface ManualRefreshOptions {
  /** 已刷新次数 */
  refreshedCount: number;

  /** 刷新价格 */
  price:number

  /** locks */
  locks?: string[];
}

/**
 * 商店商品
 */
export interface ShopItem {
  /** 商品ID */
  id: string;
  /** 商店ID */
  shopId: string;
  /** 商品状态 */
  status: ShopItemStatus;
  /** 单价 */
  price: ResourceInventoryDelta;
  /** 奖励 */
  reward: ResourceInventoryMultipleDelta;
}

/**
 * 商店商品状态
 */
export enum ShopItemStatus {
  AVAILABLE = 1,  // 可购买
  SOLD = 2,       // 已售出
  EXPIRED = 3,    // 已过期
  REMOVED = 4     // 已下架
}

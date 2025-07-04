/**
 * 资源模块共享 Slice Actions 定义
 *
 * 本文件定义了客户端和服务端共享的状态操作方法。
 */

import type { ResourceInstance, ResourceInventory } from "../../protocol/resource";

/**
 * 资源共享状态 Slice Actions
 *
 * 定义客户端和服务端共享的状态操作方法
 */
export interface ResourceSharedActions {
	/** 添加资源到指定仓库 */
	addResource: (inventoryId: string, resource: ResourceInstance) => void;

	/** 批量添加资源 */
	addResources: (inventoryId: string, resources: Array<ResourceInstance>) => void;

	/** 清空所有仓库 */
	clearAllInventories: () => void;

	/** 清空指定仓库 */
	clearInventory: (inventoryId: string) => void;

	/** 初始化仓库数据 */
	initializeInventories: (inventories: Record<string, ResourceInventory>) => void;

	/** 锁定/解锁物品 */
	lockItem: (inventoryId: string, itemId: string, locked: boolean) => void;

	/** 合并可堆叠物品 */
	mergeStackableItems: (inventoryId: string, sourceId: string, targetId: string) => void;

	/** 移动物品到其他仓库 */
	moveItem: (
		sourceInventoryId: string,
		targetInventoryId: string,
		itemId: string,
		quantity?: number,
	) => void;

	/** 移除资源 */
	removeResource: (inventoryId: string, itemId: string, quantity?: number) => void;

	/** 拆分堆叠物品 */
	splitStackedItem: (inventoryId: string, itemId: string, splitQuantity: number) => void;

	/** 更新资源数量 */
	updateResourceQuantity: (inventoryId: string, itemId: string, newQuantity: number) => void;
}

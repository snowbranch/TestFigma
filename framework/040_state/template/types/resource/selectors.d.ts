/**
 * 资源模块共享选择器定义
 *
 * 本文件定义了用于查询共享状态的选择器方法。
 */

import type { ResourceInstance } from "../../protocol/resource";

/**
 * 资源共享状态选择器接口
 *
 * 定义用于查询共享状态的选择器方法
 */
export interface ResourceSharedSelectors {
	/** 获取指定仓库的物品列表 */
	selectInventoryItems: (inventoryId: string) => Array<ResourceInstance>;

	/** 检查背包是否已满 */
	selectIsInventoryFull: (inventoryId: string) => boolean;

	/** 获取指定物品实例 */
	selectItemById: (itemId: string) => ResourceInstance | undefined;

	/** 获取可堆叠的同类物品 */
	selectStackableItems: (resourceId: string, inventoryId: string) => Array<ResourceInstance>;
}

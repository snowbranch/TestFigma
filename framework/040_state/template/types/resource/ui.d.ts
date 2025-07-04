/**
 * 资源模块 UI 状态类型定义
 *
 * 本文件定义了资源管理模块的客户端 UI 状态。 这些状态仅存在于客户端，不会与服务端同步。
 */

import type { ResourceInstance, ResourceRarity, ResourceType } from "../../protocol/resource";

/**
 * 资源 UI 状态
 *
 * 管理所有与界面交互相关的临时状态
 */
export interface ResourceUIState {
	/** 背包界面状态 */
	inventory: InventoryUIState;

	/** 全局操作状态 */
	operations: ResourceOperationState;
}

/** 背包界面状态 */
export interface InventoryUIState {
	/** 当前激活的标签页/分类 */
	activeTab: "all" | ResourceType;

	/** 筛选条件 */
	filters: ResourceFilters;

	/** 是否处于批量选择模式 */
	isMultiSelectMode: boolean;

	/** 背包是否打开 */
	isOpen: boolean;

	/** 批量选择的物品 ID 列表 */
	multiSelectIds: Array<string>;

	/** 搜索关键词 */
	searchQuery: string;

	/** 当前选中的物品实例 ID */
	selectedItemId: string | undefined;

	/** 是否显示物品详情 */
	showItemDetails: boolean;

	/** 排序方式 */
	sortBy: ResourceSortType;
}

/** 通知状态 */
export interface ResourceNotificationState {
	/** 错误消息 */
	errorMessage: string | undefined;

	/** 最近获得的物品列表 */
	recentAcquisitions: Array<ResourceAcquisition>;

	/** 是否显示获得物品动画 */
	showAcquisitionAnimation: boolean;

	/** 成功消息 */
	successMessage: string | undefined;
}

/** 全局操作状态 */
export interface ResourceOperationState {
	/** 是否正在加载库存数据 */
	isLoadingInventory: boolean;

	/** 是否正在执行物品操作（使用/销毁等） */
	isProcessingItem: boolean;

	/** 操作类型 */
	operationType: ResourceOperationType | undefined;

	/** 当前操作的物品 ID */
	processingItemId: string | undefined;
}

/**
 * 资源排序类型
 *
 * - Name: 按名称排序
 * - Quantity: 按数量排序
 * - Rarity: 按稀有度排序
 * - Recent: 按获得时间排序
 * - Type: 按类型排序
 */
export type ResourceSortType = "name" | "quantity" | "rarity" | "recent" | "type";

/** 资源筛选条件 */
export interface ResourceFilters {
	/** 只显示已锁定物品 */
	lockedOnly?: boolean;

	/** 数量范围 */
	quantityRange?: {
		max?: number;
		min?: number;
	};

	/** 按稀有度筛选 */
	rarities?: Array<ResourceRarity>;

	/** 只显示可堆叠物品 */
	stackableOnly?: boolean;

	/** 按类型筛选 */
	types?: Array<ResourceType>;
}

/** 资源获得记录 */
export interface ResourceAcquisition {
	/** 是否已查看 */
	isViewed: boolean;

	/** 获得的资源实例 */
	resource: ResourceInstance;

	/** 来源描述 */
	source: string;

	/** 获得时间戳 */
	timestamp: number;
}

/**
 * 资源操作类型
 *
 * - Destroy: 销毁物品
 * - Lock: 锁定物品
 * - Merge: 合并堆叠
 * - Split: 拆分堆叠
 * - Unlock: 解锁物品
 * - Use: 使用物品
 */
export type ResourceOperationType = "destroy" | "lock" | "merge" | "split" | "unlock" | "use";

/**
 * 资源 UI 状态 Slice Actions
 *
 * 定义客户端 UI 状态的操作方法
 */
export interface ResourceUIActions {
	// 背包界面操作
	/** 清除所有筛选条件 */
	clearFilters: () => void;

	/** 清除搜索 */
	clearSearch: () => void;

	/** 清除成功消息 */
	clearSuccessMessage: () => void;

	/** 关闭所有界面 */
	closeAllModals: () => void;

	// 操作状态
	/** 结束物品操作 */
	endItemOperation: () => void;

	/** 进入批量选择模式 */
	enterMultiSelectMode: () => void;

	/** 退出批量选择模式 */
	exitMultiSelectMode: () => void;

	/** 标记获得物品为已查看 */
	markAcquisitionViewed: (acquisitionId: string) => void;

	/** 设置活动标签页 */
	setActiveTab: (tab: "all" | ResourceType) => void;

	/** 设置错误消息 */
	setErrorMessage: (message: string) => void;

	/** 设置筛选条件 */
	setFilters: (filters: Partial<ResourceFilters>) => void;

	/** 设置加载状态 */
	setLoadingInventory: (loading: boolean) => void;

	/** 设置搜索关键词 */
	setSearchQuery: (query: string) => void;

	/** 设置选中的物品 */
	setSelectedItem: (itemId: string | undefined) => void;

	/** 设置排序方式 */
	setSortBy: (sortBy: ResourceSortType) => void;

	/** 设置成功消息 */
	setSuccessMessage: (message: string) => void;

	/** 开始物品操作 */
	startItemOperation: (itemId: string, operationType: ResourceOperationType) => void;

	/** 切换背包开关状态 */
	toggleInventory: () => void;

	/** 切换物品选择状态（批量选择） */
	toggleItemSelection: (itemId: string) => void;
}

/**
 * 资源 UI 选择器接口
 *
 * 定义用于查询 UI 状态的选择器方法
 */
export interface ResourceUISelectors {
	/** 获取筛选后的物品列表 */
	selectFilteredItems: (inventoryId: string, filters: ResourceFilters) => Array<ResourceInstance>;

	/** 检查是否有待处理的操作 */
	selectHasPendingOperations: () => boolean;

	/** 获取当前选中的物品 */
	selectSelectedItem: () => ResourceInstance | undefined;

	/** 获取排序后的物品列表 */
	selectSortedItems: (
		items: Array<ResourceInstance>,
		sortBy: ResourceSortType,
	) => Array<ResourceInstance>;
}

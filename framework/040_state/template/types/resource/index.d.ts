/**
 * 资源模块 Store 类型定义
 *
 * 本文件组合了共享状态和 UI 状态，提供完整的资源 Store 结构。
 */

import type { ResourceSharedSelectors } from "./selectors";
import type { ResourceSharedActions } from "./slices";
import type { ResourceSharedState } from "./types";
import type { ResourceUIActions, ResourceUISelectors, ResourceUIState } from "./ui";

/**
 * 客户端资源 Store 状态
 *
 * 组合了共享状态和 UI 状态
 */
export interface ResourceClientStore {
	/** 共享状态 - 与服务端同步的业务数据 */
	shared: ResourceSharedState;

	/** UI 状态 - 客户端独有的界面状态 */
	ui: ResourceUIState;
}

/**
 * 服务端资源 Store 状态
 *
 * 仅包含共享状态
 */
export type ResourceServerStore = ResourceSharedState;

/**
 * 资源 Store 完整 Actions 接口
 *
 * 组合了共享状态和 UI 状态的操作方法
 */
export interface ResourceStoreActions extends ResourceSharedActions, ResourceUIActions {}

/**
 * 资源 Store 完整选择器接口
 *
 * 组合了共享状态选择器和 UI 状态选择器
 */
export interface ResourceStoreSelectors extends ResourceSharedSelectors, ResourceUISelectors {}

// 导出所有子模块
export * from "./selectors";
export * from "./slices";
export * from "./types";
export * from "./ui";

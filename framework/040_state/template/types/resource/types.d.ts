/**
 * 资源模块共享类型定义
 *
 * 本文件定义了资源模块的扩展类型。 核心状态类型使用 protocol 中定义的 ResourceState。
 */

import type { ResourceState } from "../../protocol/resource";

/**
 * 资源共享状态
 *
 * 直接使用 protocol 中定义的 ResourceState
 */
export type ResourceSharedState = ResourceState;

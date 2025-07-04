# 视图层架构 (View Layer Architecture)

## 概述

视图层是用户界面的核心架构层，基于 React 函数式组件和 roblox-ts 技术栈。本架构遵循现代前端最佳实践，提供类型安全、高性能和可维护的UI解决方案。

## 核心理念

### 1. 函数式组件优先
- 所有组件都使用函数式组件模式
- 通过 hooks 管理状态和副作用
- 避免类组件的复杂性和生命周期管理

### 2. 单向数据流
- 数据从父组件流向子组件
- 通过 props 传递数据和事件回调
- 使用 Reflex (Redux) 进行全局状态管理

## 组件分层设计

详细的组件层级架构请参考：[组件层级架构文档](./component-layers.md)

主要包含以下层级：
- **原子组件** (Atomic Components) - 最基础的 UI 元素
- **分子组件** (Molecular Components) - 原子组件的组合
- **组织组件** (Organism Components) - 包含业务逻辑的功能模块
- **模板组件** (Template Components) - 页面布局定义
- **页面组件** (Page Components) - 完整的页面实例

### 数据流原则
- 数据从上往下流动：页面 → 组织 → 分子 → 原子
- 通过 props 传递数据，避免 prop drilling
- 页面组件关联 Store，其他层级通过 props 接收数据

## 尺寸和位置规范

### 界面尺寸

按照 1920*1080 的设备尺寸, 进行编码.

### ui规范

所有 UI 组件必须遵循以下尺寸和位置规范：

1. **禁止直接使用像素值**
   ```typescript
   // ❌ 错误示例
   <frame Size={new UDim2(0, 100, 0, 50)} />
   <frame Position={new UDim2(0, 20, 0, 30)} />

   // ✅ 正确示例
   import { usePx } from "client/ui/hooks/use-px";
   
   const px = usePx();
   
   <frame Size={new UDim2(0, px(100), 0, px(50))} />
   ```

2. **使用场景**：
   - `usePx`: 用于所有情景


## 组件结构规范

1. **基础结构**：
   ```typescript
   import React from "@rbxts/react";
   import { usePx } from "client/ui/hooks/use-px";

   interface Props {
       // 组件属性定义
   }

   export function Component(props: Props) {
       const px = usePx();

       return (
           <frame
               Size={new UDim2(0, px(10), 0, px(5))}
               Position={new UDim2(0, px(1), 0, px(1))}
           >
               {/* 组件内容 */}
           </frame>
       );
   }
   ```
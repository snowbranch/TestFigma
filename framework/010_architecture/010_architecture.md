# 架构概述

## 总体架构

本框架采用现代化的分层架构设计，基于 Flamework 依赖注入、Reflex 状态管理和 React 视图层构建。架构设计遵循关注点分离、高内聚低耦合的原则，为大型 Roblox 游戏开发提供企业级解决方案。

## 架构特点

- **分层设计**：客户端和服务端采用不同但互补的分层架构
- **依赖注入**：使用 Flamework 实现控制反转和依赖管理
- **状态管理**：Reflex (Redux 模式) 提供可预测的状态管理
- **类型安全**：端到端的 TypeScript 类型安全
- **模块化**：按功能域组织的模块化结构

## 客户端架构

```
┌─────────────────────────────────────┐
│          表现层 (View)              │  React 组件、UI 逻辑
├─────────────────────────────────────┤
│         控制器层 (Controller)        │  业务逻辑协调
├─────────────────────────────────────┤
│          网络层 (Network)           │  API 客户端
├─────────────────────────────────────┤
│          数据层 (Store)             │  Reflex 状态管理
└─────────────────────────────────────┘
```

**数据流**：用户交互 → React → Action → Store → View 更新

## 服务端架构

```
┌─────────────────────────────────────┐
│          网关层 (Gateway)           │  API 入口、参数验证
├─────────────────────────────────────┤
│          服务层 (Service)           │  核心业务逻辑
├─────────────────────────────────────┤
│          数据层 (Data)              │  状态管理与持久化
└─────────────────────────────────────┘
```

**数据流**：请求 → 网关验证 → 服务处理 → 数据存储

## 核心模块

### 依赖注入系统

- 使用装饰器声明服务和控制器
- 自动解析依赖关系
- 统一的生命周期管理

### 状态管理系统

- **客户端**：UI 状态、缓存状态、游戏状态
- **服务端**：世界状态、玩家状态
- **共享状态**：自动同步的跨端状态

### 网络通信

- **API Gateway**：类 REST 风格的 API 设计
- **类型安全**：端到端的类型推导
- **状态同步**：基于 Reflex 中间件的自动同步

### 数据持久化

- **Reflex Store**：内存状态管理
- **Lapis**：基于 DataStore 的持久化
- **Memory Store**：高性能缓存

## 模块组织

采用`三层`模块领域组织, 分为:

- 通用层: 仅提供主机内部模块间调用接口,互相之间无一依赖
- 业务层: 与用户进行交互, 互相之间无依赖
- 集成层: 与用户进行交互, 可以依赖通用

## 技术栈

- **语言**：TypeScript (roblox-ts)
- **框架**：Flamework (依赖注入)
- **状态管理**：Reflex (Redux 模式)
- **UI**：React + Roact
- **网络**：Remo (类型安全 RPC)
- **持久化**：Lapis (DataStore 封装)
- **测试**：Jest + Jack

## 设计原则

1. **单一职责**：每个模块只负责一个功能域
2. **依赖倒置**：依赖抽象而非具体实现
3. **开闭原则**：对扩展开放，对修改关闭
4. **关注点分离**：业务逻辑与表现层分离

详细的客户端和服务端架构设计请参考：

- [客户端架构设计](../010_concept/011_client-architecture.md)
- [服务端架构设计](../010_concept/012_server-architecture.md)

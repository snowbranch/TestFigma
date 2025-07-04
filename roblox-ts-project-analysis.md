# Roblox-TS 项目结构分析

## 项目概述
该项目是使用 roblox-ts 框架创建的 TypeScript 到 Lua 的 Roblox 游戏项目。

## 目录结构

### 根目录文件
- `package.json` - Node.js 项目配置和依赖管理
- `tsconfig.json` - TypeScript 编译器配置
- `default.project.json` - Rojo 项目配置文件，定义了 Roblox 文件系统映射
- `package-lock.json` - 锁定依赖版本

### 源码目录 (`src/`)
- `client/` - 客户端代码（运行在玩家设备上）
  - `main.client.ts` - 客户端主入口文件
- `server/` - 服务端代码（运行在 Roblox 服务器上）
  - `main.server.ts` - 服务端主入口文件
- `shared/` - 共享代码（客户端和服务端都可使用）
  - `module.ts` - 共享模块示例

### 输出目录 (`out/`)
- `client/` - 编译后的客户端 Lua 代码
- `server/` - 编译后的服务端 Lua 代码
- `shared/` - 编译后的共享 Lua 代码
- `tsconfig.tsbuildinfo` - TypeScript 增量编译信息

### 运行时库 (`include/`)
- `Promise.lua` - Promise 实现
- `RuntimeLib.lua` - 运行时库文件

### 依赖目录 (`node_modules/`)
- 包含所有 npm 依赖包

## 关键配置说明

### TypeScript 配置
- 源码目录: `src/`
- 输出目录: `out/`
- 启用严格模式和实验性装饰器
- 配置 JSX 支持 (用于 React 组件)

### Rojo 配置
- 客户端脚本映射到 `StarterPlayerScripts`
- 服务端脚本映射到 `ServerScriptService`
- 共享模块映射到 `ReplicatedStorage`
- 包含第三方库的 `rbxts_include` 文件夹

### 主要依赖
- `roblox-ts` - 核心编译器
- `@rbxts/types` - Roblox API 类型定义
- `@rbxts/compiler-types` - 编译器类型支持
- ESLint 和 Prettier - 代码质量和格式化工具

## 开发工作流

### 构建命令
- `npm run build` - 编译 TypeScript 到 Lua
- `npm run watch` - 监听模式编译

### 典型开发流程
1. 编写 TypeScript 代码在 `src/` 目录
2. 使用 `npm run watch` 自动编译
3. 使用 Rojo 将编译后的代码同步到 Roblox Studio
4. 在 Roblox Studio 中测试和调试

## 代码示例分析

### 共享模块 (src/shared/module.ts)
```typescript
export function makeHello(name: string) {
    return `Hello from ${name}!`;
}
```

### 客户端代码 (src/client/main.client.ts)
```typescript
import { makeHello } from "shared/module";
print(makeHello("main.client.ts"));
```

### 服务端代码 (src/server/main.server.ts)
```typescript
import { makeHello } from "shared/module";
print(makeHello("main.server.ts"));
```

这个基础项目展示了如何在客户端和服务端共享代码模块，是 Roblox 游戏开发的良好起点。


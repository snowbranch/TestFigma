# Roblox-ts 编码规范

本文档介绍在使用 roblox-ts 开发时需要注意的特定语法、规范和最佳实践。roblox-ts 是将 TypeScript 编译为 Luau 的工具，了解其特性和限制对于编写高质量代码至关重要。

## 核心差异

### TypeScript vs Luau 的关键区别

#### 1. 真值判断差异

在 TypeScript/JavaScript 中，以下值被视为假值（falsy）：
- `false`
- `0`
- `""`（空字符串）
- `null`
- `undefined`
- `NaN`

但在 Luau 中，**只有 `false` 和 `nil`（对应 TypeScript 的 `undefined`）是假值**。

```typescript
// ❌ 错误：在 Luau 中，0 是真值
if (\!count) {
    print("count is zero"); // 这段代码在 count = 0 时不会执行
}

// ✅ 正确：显式检查
if (count === 0 || count === undefined) {
    print("count is zero or undefined");
}

// ❌ 错误：空字符串在 Luau 中是真值
if (\!name) {
    print("name is empty");
}

// ✅ 正确：显式检查
if (name === "" || name === undefined) {
    print("name is empty or undefined");
}
```

#### 2. 数组操作

Luau 的数组索引从 1 开始，但 roblox-ts 为我们处理了这个差异。需要注意的是方法名称的不同：

```typescript
// ❌ 错误：使用 JavaScript 的 length 属性
const count = myArray.length;

// ✅ 正确：使用 size() 方法
const count = myArray.size();

// ✅ 数组遍历
for (const item of myArray) {
    print(item);
}

// ✅ 带索引的遍历（注意：索引从 0 开始，roblox-ts 会自动处理）
myArray.forEach((item, index) => {
    print(`Item ${index}: ${item}`);
});
```

#### 3. 对象遍历

```typescript
// ✅ 使用 pairs 遍历对象
for (const [key, value] of pairs(myObject)) {
    print(key, value);
}

// ✅ 使用 Object.entries（roblox-ts 会转换为合适的 Luau 代码）
for (const [key, value] of Object.entries(myObject)) {
    print(key, value);
}
```

## 类型系统

### 1. 类型检查

```typescript
// ❌ 错误：使用 typeof（在某些情况下可能不准确）
if (typeof value === "string") {
    // ...
}

// ✅ 正确：使用 typeIs
import { typeIs } from "@rbxts/types";

if (typeIs(value, "string")) {
    // value 现在被正确推断为 string 类型
}

// ✅ 对于 Roblox 实例，使用 IsA
if (instance.IsA("Part")) {
    // instance 现在被推断为 Part 类型
}
```

### 2. 类型断言

```typescript
// ✅ 使用 as 进行类型断言
const part = instance as Part;

// ✅ 更安全的方式：先检查再断言
if (instance.IsA("Part")) {
    const part = instance; // 自动推断为 Part
}
```

## Promise 和异步

roblox-ts 提供了特殊的 Promise 实现：

```typescript
// ✅ 创建 Promise
const promise = new Promise<string>((resolve, reject) => {
    task.wait(1);
    resolve("Done\!");
});

// ✅ 使用 async/await
async function loadData(): Promise<PlayerData> {
    const data = await fetchPlayerData();
    return data;
}

// ✅ Promise.try - 安全地包装可能抛出错误的代码
const result = Promise.try(() => {
    return riskyOperation();
});

// ✅ Promise.fromEvent - 将事件转换为 Promise
const player = await Promise.fromEvent(
    Players.PlayerAdded,
    (addedPlayer) => addedPlayer.UserId === targetUserId
);
```

## 内存管理

### 使用 Janitor 进行资源清理

```typescript
import { Janitor } from "@rbxts/janitor";

class MyComponent {
    private janitor = new Janitor();

    constructor() {
        // 添加需要清理的连接
        this.janitor.Add(
            RunService.Heartbeat.Connect(() => {
                // 更新逻辑
            })
        );

        // 添加需要销毁的实例
        const part = new Instance("Part");
        this.janitor.Add(part);

        // 添加自定义清理函数
        this.janitor.Add(() => {
            print("Cleaning up...");
        });
    }

    public destroy(): void {
        this.janitor.Destroy();
    }
}
```

## 模块和导入

### 1. 导入规范

```typescript
// ✅ 类型导入使用 type 关键字
import type { Logger } from "@rbxts/log";
import type { PlayerData } from "shared/types";

// ✅ 值导入
import { Players, RunService } from "@rbxts/services";

// ✅ 导入顺序：第三方库 → 绝对路径 → 相对路径
import { Service } from "@flamework/core";
import { PlayerService } from "server/services/player-service";
import { calculateDamage } from "./utils";
```

### 2. 导出规范

```typescript
// ✅ 命名导出（推荐）
export class PlayerService {}
export interface PlayerData {}
export function calculateDamage() {}

// ✅ 默认导出（谨慎使用）
export default class MainController {}

// ✅ 重新导出
export { PlayerService } from "./player-service";
export * from "./types";
```

## Roblox API 使用

### 1. 服务获取

```typescript
import { Players, Workspace, RunService } from "@rbxts/services";

// ✅ 直接使用导入的服务
const player = Players.FindFirstChild("PlayerName");

// ❌ 不要使用 game.GetService
const players = game.GetService("Players"); // 避免
```

### 2. 实例创建

```typescript
// ✅ 使用 new Instance
const part = new Instance("Part");
part.Parent = Workspace;
part.Position = new Vector3(0, 10, 0);

// ✅ 设置属性
part.Size = new Vector3(4, 1, 2);
part.BrickColor = new BrickColor("Bright red");
part.Material = Enum.Material.Neon;
```

### 3. 事件处理

```typescript
// ✅ 连接事件
const connection = part.Touched.Connect((hit) => {
    if (hit.Parent?.FindFirstChild("Humanoid")) {
        print("Player touched the part\!");
    }
});

// ✅ 断开连接
connection.Disconnect();

// ✅ 使用 Once 进行一次性监听
part.Touched.Once((hit) => {
    print("First touch\!");
});
```

## 性能优化

### 1. 避免频繁的表创建

```typescript
// ❌ 错误：在循环中创建新表
function update() {
    for (const player of Players.GetPlayers()) {
        const data = { // 每次都创建新对象
            name: player.Name,
            health: 100
        };
    }
}

// ✅ 正确：重用对象或使用对象池
const playerDataCache = new Map<Player, PlayerData>();

function update() {
    for (const player of Players.GetPlayers()) {
        let data = playerDataCache.get(player);
        if (\!data) {
            data = { name: player.Name, health: 100 };
            playerDataCache.set(player, data);
        }
    }
}
```

### 2. 使用适当的数据结构

```typescript
// ✅ 对于频繁查找，使用 Map 而不是数组
const playerMap = new Map<number, Player>();

// ✅ 对于唯一值集合，使用 Set
const activePlayerIds = new Set<number>();

// ✅ 对于有序集合，使用数组
const leaderboard: Array<PlayerScore> = [];

// ✅ 对于大量数据的过滤和查找，预先构建索引
const playersByTeam = new Map<Team, Set<Player>>();
```

## 调试技巧

### 1. 日志输出

```typescript
// ✅ 使用结构化日志
import type { Logger } from "@rbxts/log";

class MyService {
    constructor(private readonly logger: Logger) {}

    public processData(data: unknown): void {
        this.logger.Debug("Processing data", { data });
        
        try {
            // 处理逻辑
        } catch (error) {
            this.logger.Error("Failed to process data", { error });
        }
    }
}
```

### 2. 断言和验证

```typescript
// ✅ 使用断言进行开发时检查
function divide(a: number, b: number): number {
    assert(b \!== 0, "Division by zero");
    return a / b;
}

// ✅ 使用类型守卫
function isPlayerData(data: unknown): data is PlayerData {
    return typeIs(data, "table") && 
           typeIs(data.userId, "number") &&
           typeIs(data.name, "string");
}
```

## 常见陷阱和解决方案

### 1. 循环引用

```typescript
// ❌ 避免循环引用
// file: a.ts
import { B } from "./b";
export class A {
    b = new B();
}

// file: b.ts
import { A } from "./a";
export class B {
    a = new A();
}

// ✅ 使用依赖注入或延迟加载解决
// file: a.ts
export class A {
    private b?: B;
    
    public setB(b: B): void {
        this.b = b;
    }
}
```

### 2. 全局变量



### 3. 数值精度

```typescript
// ⚠️ 注意浮点数精度问题
const result = 0.1 + 0.2; // 可能不等于 0.3

// ✅ 对于需要精确计算的场景，使用整数
const cents = 10 + 20; // 30 分
const dollars = cents / 100; // 0.30 美元
```

## 任务调度和性能

### 1. 合理使用 task 库

```typescript
// ✅ 使用 task.spawn 进行异步执行
task.spawn(() => {
    // 执行不阻塞主线程的逻辑
    processLargeDataSet();
});

// ✅ 使用 task.defer 延迟执行
task.defer(() => {
    // 在下一帧执行清理工作
    cleanupResources();
});

// ✅ 使用 task.wait 进行等待
async function delayedAction(): Promise<void> {
    await task.wait(1); // 等待 1 秒
    performAction();
}

// ✅ 使用 task.cancel 取消任务
const taskId = task.delay(5, () => {
    print("Delayed task");
});

// 在需要时取消
task.cancel(taskId);
```

### 2. 批处理和限流

```typescript
// ✅ 批处理操作以提高性能
class BatchProcessor<T> {
    private batch: T[] = [];
    private readonly batchSize: number;
    private timeoutId?: thread;

    constructor(
        batchSize: number = 50,
        private readonly processor: (items: T[]) => void
    ) {
        this.batchSize = batchSize;
    }

    public add(item: T): void {
        this.batch.push(item);

        if (this.batch.size() >= this.batchSize) {
            this.flush();
        } else if (!this.timeoutId) {
            // 设置超时自动处理
            this.timeoutId = task.delay(0.1, () => this.flush());
        }
    }

    private flush(): void {
        if (this.batch.size() > 0) {
            const items = [...this.batch];
            this.batch = [];
            this.processor(items);
        }
        
        if (this.timeoutId) {
            task.cancel(this.timeoutId);
            this.timeoutId = undefined;
        }
    }
}
```

## 最佳实践总结

1. **始终进行显式的真值检查**，特别是对于 `0`、`""` 和 `NaN`
2. **使用 roblox-ts 提供的方法**，如 `size()` 而不是 `length`
3. **充分利用类型系统**，避免使用 `any`
4. **正确处理异步操作**，使用 Promise 和 async/await
5. **注意内存管理**，使用 Janitor 清理资源
6. **遵循模块化原则**，避免全局变量和循环引用
7. **使用适当的数据结构**，根据使用场景选择 Map、Set 或数组
8. **编写防御性代码**，使用断言和类型守卫
9. **合理使用任务调度**，避免阻塞主线程
10. **实施批处理和限流**，优化大量数据操作的性能

通过遵循这些规范，您可以编写出既符合 TypeScript 习惯又能在 Roblox 环境中高效运行的代码。

# Flamework 框架使用指南

Flamework 是一个强大的 Roblox TypeScript 框架，提供了依赖注入、装饰器模式和生命周期管理等现代化开发特性。本文档将详细介绍如何在项目中使用 Flamework。

## 核心概念

### 1. 依赖注入（Dependency Injection）

Flamework 的依赖注入系统让您可以轻松管理类之间的依赖关系，无需手动创建和传递实例。

```typescript
import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import type { PlayerDataService } from "./player-data-service";

@Service()
export class ExperienceService {
    constructor(
        private readonly logger: Logger,
        private readonly playerDataService: PlayerDataService
    ) {
        // 依赖会自动注入，无需手动创建
    }
}
```

### 2. 装饰器（Decorators）

装饰器是 Flamework 的核心特性，用于标记类的用途和行为。

#### 主要装饰器

- `@Service()` - 标记服务端单例服务
- `@Controller()` - 标记客户端单例控制器
- `@Component()` - 标记可复用组件
- `@Decorator()` - 创建自定义装饰器

```typescript
// 服务端服务
@Service({ loadOrder: 1 })
export class ConfigService implements OnInit {
    public onInit(): void {
        print("Config service initialized");
    }
}

// 客户端控制器
@Controller({ loadOrder: 2 })
export class UIController implements OnStart {
    public onStart(): void {
        print("UI controller started");
    }
}
```

### 3. 生命周期接口

Flamework 提供了丰富的生命周期接口，让您在适当的时机执行代码。

```typescript
import { Service, OnInit, OnStart, OnTick } from "@flamework/core";

@Service()
export class GameService implements OnInit, OnStart, OnTick {
    public onInit(): void {
        // 在服务初始化时调用（依赖注入完成后）
        print("Service initialized");
    }

    public onStart(): void {
        // 在所有服务初始化完成后调用
        print("Service started");
    }

    public onTick(dt: number): void {
        // 每帧调用
        print(`Delta time: ${dt}`);
    }
}
```

## 生命周期详解

### 执行顺序

1. **构造函数** - 实例创建和依赖注入
2. **OnInit** - 初始化逻辑
3. **OnStart** - 启动逻辑（所有 OnInit 完成后）
4. **OnTick/OnHeartbeat/OnRender** - 运行时循环

### 可用的生命周期接口

```typescript
// 初始化阶段
interface OnInit {
    onInit(): void;
}

// 启动阶段
interface OnStart {
    onStart(): void;
}

// 运行时循环
interface OnTick {
    onTick(dt: number): void;  // 每个 tick
}

interface OnHeartbeat {
    onHeartbeat(dt: number): void;  // RunService.Heartbeat
}

interface OnRender {
    onRender(dt: number): void;  // RunService.RenderStepped（仅客户端）
}

// 玩家事件
interface OnPlayerJoin {
    onPlayerJoin(player: Player): void;
}

interface OnPlayerLeave {
    onPlayerLeave(player: Player): void;
}

// 角色事件
interface OnCharacterAdd {
    onCharacterAdd(player: Player, character: Model): void;
}

interface OnCharacterRemove {
    onCharacterRemove(player: Player): void;
}
```

## 网络通信

Flamework 提供了类型安全的网络通信机制。

### 定义网络接口

```typescript
// shared/remotes/index.ts
import { Networking } from "@flamework/networking";

// 客户端到服务端的事件
interface ClientToServerEvents {
    playerAction: {
        requestJump: () => void;
        updatePosition: (position: Vector3) => void;
    };
}

// 服务端到客户端的事件
interface ServerToClientEvents {
    gameState: {
        updateScore: (score: number) => void;
        showNotification: (message: string) => void;
    };
}

// 客户端到服务端的函数（有返回值）
interface ClientToServerFunctions {
    getData: {
        getPlayerStats: () => PlayerStats;
    };
}

// 服务端到客户端的函数
interface ServerToClientFunctions {
    prompt: {
        confirmAction: (message: string) => boolean;
    };
}

// 创建网络对象
export const GlobalEvents = Networking.createEvent<
    ClientToServerEvents,
    ServerToClientEvents
>();

export const GlobalFunctions = Networking.createFunction<
    ClientToServerFunctions,
    ServerToClientFunctions
>();
```

### 使用网络通信

```typescript
// 服务端
@Service()
export class NetworkService implements OnStart {
    public onStart(): void {
        // 监听客户端事件
        GlobalEvents.playerAction.requestJump.connect((player) => {
            print(`${player.Name} requested jump`);
        });

        // 向客户端发送事件
        GlobalEvents.gameState.updateScore.fire(
            player,
            100  // 新分数
        );

        // 处理客户端函数调用
        GlobalFunctions.getData.getPlayerStats.setCallback((player) => {
            return {
                level: 10,
                experience: 500
            };
        });
    }
}

// 客户端
@Controller()
export class NetworkController implements OnStart {
    public onStart(): void {
        // 向服务端发送事件
        GlobalEvents.playerAction.requestJump.fire();

        // 监听服务端事件
        GlobalEvents.gameState.updateScore.connect((score) => {
            print(`New score: ${score}`);
        });

        // 调用服务端函数
        const stats = GlobalFunctions.getData.getPlayerStats.invoke();
        print(`Player level: ${stats.level}`);
    }
}
```

## 组件系统

Flamework 的组件系统让您可以创建可复用的游戏对象组件。

### 定义组件

```typescript
import { Component, BaseComponent } from "@flamework/components";

interface DamageableAttributes {
    MaxHealth: number;
    CurrentHealth?: number;
}

@Component({
    tag: "Damageable",
    defaults: {
        MaxHealth: 100
    }
})
export class DamageableComponent extends BaseComponent<DamageableAttributes> {
    private currentHealth: number;

    constructor() {
        super();
        this.currentHealth = this.attributes.CurrentHealth ?? this.attributes.MaxHealth;
    }

    public takeDamage(amount: number): void {
        this.currentHealth = math.max(0, this.currentHealth - amount);
        
        if (this.currentHealth === 0) {
            this.onDeath();
        }
    }

    private onDeath(): void {
        this.instance.Destroy();
    }
}
```

### 使用组件

```typescript
@Service()
export class CombatService implements OnStart {
    constructor(
        private readonly components: Components
    ) {}

    public onStart(): void {
        // 获取所有带有 Damageable 标签的组件
        const damageables = this.components.getAllComponents<DamageableComponent>();
        
        // 监听新组件的添加
        this.components.onComponentAdded<DamageableComponent>((component) => {
            print("New damageable added");
        });
    }

    public dealDamage(instance: Instance, amount: number): void {
        const component = this.components.getComponent<DamageableComponent>(instance);
        component?.takeDamage(amount);
    }
}
```

## 自定义装饰器

您可以创建自定义装饰器来扩展 Flamework 的功能。

```typescript
import { Modding, Reflect } from "@flamework/core";

// 定义元数据键
const METADATA_KEY = "command:metadata";

// 创建装饰器
export function Command(name: string) {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        Reflect.defineMetadata(
            METADATA_KEY,
            { name, method: propertyKey },
            target
        );
    };
}

// 使用装饰器
@Service()
export class CommandService {
    @Command("teleport")
    public teleportCommand(player: Player, target: Vector3): void {
        // 实现传送逻辑
    }

    @Command("heal")
    public healCommand(player: Player, amount: number): void {
        // 实现治疗逻辑
    }
}

// 处理装饰器
@Service()
export class CommandHandler implements OnStart {
    private commands = new Map<string, (player: Player, ...args: unknown[]) => void>();

    public onStart(): void {
        // 扫描所有带有 Command 装饰器的方法
        const services = Modding.getServices();
        
        for (const service of services) {
            const metadata = Reflect.getMetadata(METADATA_KEY, service);
            if (metadata) {
                const method = (service as any)[metadata.method];
                this.commands.set(metadata.name, method.bind(service));
            }
        }
    }
}
```

## 配置和选项

### Service 和 Controller 选项

```typescript
@Service({
    loadOrder: 1,  // 加载顺序（数字越小越先加载）
})
export class EarlyService {}

@Controller({
    loadOrder: 999,  // 延迟加载
})
export class LateController {}
```

### 组件选项

```typescript
@Component({
    tag: "MyComponent",  // 组件标签
    defaults: {          // 默认属性值
        Speed: 16,
        JumpPower: 50
    },
    instanceGuard: (instance) => instance.IsA("Model"),  // 实例类型守卫
    refreshAttributes: true  // 是否自动刷新属性
})
export class MyComponent extends BaseComponent {}
```

## 最佳实践

### 1. 依赖注入原则

```typescript
// ✅ 好的做法：通过构造函数注入依赖
@Service()
export class GoodService {
    constructor(
        private readonly logger: Logger,
        private readonly dataService: DataService
    ) {}
}

// ❌ 坏的做法：在类内部创建依赖
@Service()
export class BadService {
    private logger = new Logger();  // 避免这样做
    private dataService = new DataService();  // 避免这样做
}
```

### 2. 生命周期使用

```typescript
@Service()
export class LifecycleService implements OnInit, OnStart {
    private initialized = false;

    public onInit(): void {
        // ✅ 初始化内部状态
        this.initialized = true;
        
        // ❌ 不要在这里访问其他服务的状态
        // 其他服务可能还未初始化
    }

    public onStart(): void {
        // ✅ 现在可以安全地与其他服务交互
        // 所有服务都已完成初始化
    }
}
```

### 3. 错误处理

```typescript
@Service()
export class RobustService {
    constructor(private readonly logger: Logger) {}

    public async performAction(): Promise<void> {
        try {
            await this.riskyOperation();
        } catch (error) {
            this.logger.Error("Action failed", { error });
            // 优雅地处理错误
        }
    }
}
```

### 4. 性能考虑

```typescript
@Controller()
export class PerformantController implements OnRender {
    private frameCount = 0;
    
    public onRender(dt: number): void {
        this.frameCount++;
        
        // ✅ 降低更新频率
        if (this.frameCount % 60 === 0) {
            this.expensiveUpdate();
        }
        
        // ✅ 使用增量时间
        this.smoothUpdate(dt);
    }
}
```

## 调试技巧

### 1. 服务依赖关系

```typescript
@Service()
export class DebugService implements OnStart {
    public onStart(): void {
        // 打印所有已加载的服务
        const services = Modding.getServices();
        print("Loaded services:", services.size());
        
        // 检查特定服务是否存在
        const hasPlayerService = services.some(
            (service) => service instanceof PlayerService
        );
        print("PlayerService loaded:", hasPlayerService);
    }
}
```

### 2. 生命周期日志

```typescript
@Service()
export class VerboseService implements OnInit, OnStart {
    constructor(private readonly logger: Logger) {
        this.logger.Debug("VerboseService constructor");
    }

    public onInit(): void {
        this.logger.Debug("VerboseService onInit");
    }

    public onStart(): void {
        this.logger.Debug("VerboseService onStart");
    }
}
```

## 错误处理和中间件

### 1. 全局错误处理

```typescript
@Service()
export class ErrorHandlerService implements OnInit {
    private readonly errorLog: Array<ErrorRecord> = [];

    constructor(
        private readonly logger: Logger
    ) {}

    public onInit(): void {
        // 监听未捕获的错误
        process.on("unhandledRejection", (reason, promise) => {
            this.logError("System", "unhandledRejection", reason);
        });
    }

    public logError(
        service: string,
        method: string,
        error: unknown,
        context?: Record<string, unknown>
    ): void {
        const errorRecord: ErrorRecord = {
            timestamp: os.time(),
            service,
            method,
            error: tostring(error),
            context
        };

        this.errorLog.push(errorRecord);
        this.logger.Error(`[${service}.${method}] ${error}`, context);
    }
}
```

### 2. 网络中间件

```typescript
// 网络中间件接口
interface NetworkMiddleware {
    beforeRequest?(
        event: string,
        player: Player,
        args: unknown[]
    ): boolean | Promise<boolean>;
    
    afterRequest?(
        event: string,
        player: Player,
        result: unknown,
        args: unknown[]
    ): void;
    
    onError?(
        event: string,
        player: Player,
        error: unknown,
        args: unknown[]
    ): void;
}

// 日志中间件
@Service()
export class LoggingMiddleware implements NetworkMiddleware {
    constructor(private readonly logger: Logger) {}

    public beforeRequest(event: string, player: Player, args: unknown[]): boolean {
        this.logger.Debug(`[${player.Name}] ${event}`, { args });
        return true;
    }

    public afterRequest(
        event: string,
        player: Player,
        result: unknown,
        args: unknown[]
    ): void {
        this.logger.Debug(`[${player.Name}] ${event} completed`, { result });
    }

    public onError(
        event: string,
        player: Player,
        error: unknown,
        args: unknown[]
    ): void {
        this.logger.Error(`[${player.Name}] ${event} failed`, { error, args });
    }
}
```

### 3. 验证中间件

```typescript
@Service()
export class ValidationMiddleware implements NetworkMiddleware {
    constructor(
        private readonly logger: Logger,
        private readonly rateLimiter: RateLimiterService
    ) {}

    public async beforeRequest(
        event: string,
        player: Player,
        args: unknown[]
    ): Promise<boolean> {
        // 速率限制检查
        if (!this.rateLimiter.checkLimit(player, event)) {
            this.logger.Warn(`Rate limit exceeded for ${player.Name} on ${event}`);
            return false;
        }

        // 参数验证
        if (!this.validateArgs(event, args)) {
            this.logger.Warn(`Invalid arguments for ${player.Name} on ${event}`);
            return false;
        }

        return true;
    }

    private validateArgs(event: string, args: unknown[]): boolean {
        // 实现参数验证逻辑
        return true;
    }
}
```

## 高级模式

### 1. 装饰器组合

```typescript
// 组合多个装饰器
@Service({ loadOrder: 1 })
@LogClass()
@Throttle(100) // 限制调用频率
export class CriticalService {
    @LogMethod()
    @ValidateArgs()
    @CacheResult(5000) // 缓存结果 5 秒
    public async expensiveOperation(input: string): Promise<string> {
        // 执行耗时操作
        return await this.processData(input);
    }
}
```

### 2. 条件注入

```typescript
// 根据环境条件注入不同的实现
@Service()
export class DatabaseService {
    constructor(
        @Inject(RunService.IsStudio() ? "MockDatabase" : "ProductionDatabase")
        private readonly database: Database
    ) {}
}
```

### 3. 动态服务发现

```typescript
@Service()
export class ServiceRegistry implements OnStart {
    private services = new Map<string, unknown>();

    public onStart(): void {
        // 自动注册所有服务
        const allServices = Modding.getServices();
        
        for (const service of allServices) {
            const metadata = Reflect.getMetadata("service:name", service);
            if (metadata) {
                this.services.set(metadata.name, service);
            }
        }
    }

    public getService<T>(name: string): T | undefined {
        return this.services.get(name) as T;
    }
}
```

## 常见问题

### 1. 循环依赖

```typescript
// ❌ 避免循环依赖
@Service()
class ServiceA {
    constructor(private serviceB: ServiceB) {}
}

@Service()
class ServiceB {
    constructor(private serviceA: ServiceA) {}
}

// ✅ 使用事件或中介者模式解决
@Service()
class EventBus {
    private events = new Map<string, Set<Callback>>();
    // 实现事件系统
}
```

### 2. 单例生命周期

```typescript
// ✅ 记住：Service 和 Controller 是单例
@Service()
export class SingletonService {
    private static instanceCount = 0;
    
    constructor() {
        SingletonService.instanceCount++;
        assert(
            SingletonService.instanceCount === 1,
            "Service should only be instantiated once"
        );
    }
}
```

### 3. 内存泄漏预防

```typescript
@Service()
export class ResourceManagedService implements OnInit {
    private readonly janitor = new Janitor();
    private connections: RBXScriptConnection[] = [];

    public onInit(): void {
        // 使用 Janitor 管理资源
        this.janitor.Add(
            RunService.Heartbeat.Connect(() => this.update())
        );

        // 或手动管理连接
        const connection = Players.PlayerAdded.Connect((player) => {
            this.onPlayerAdded(player);
        });
        this.connections.push(connection);
    }

    public destroy(): void {
        this.janitor.Destroy();
        
        for (const connection of this.connections) {
            connection.Disconnect();
        }
        this.connections = [];
    }

    private update(): void {
        // 每帧更新逻辑
    }

    private onPlayerAdded(player: Player): void {
        // 玩家加入处理
    }
}
```

通过掌握 Flamework 的这些核心概念和最佳实践，您可以构建出结构清晰、易于维护的 Roblox 游戏代码。

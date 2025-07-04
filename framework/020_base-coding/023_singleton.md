# 单例模式指南

在 Flamework 框架中，单例模式通过装饰器自动管理，确保一个类只有一个实例。

## 单例类型

根据运行环境，单例分为三种：

1. **Service** - 服务端单例（`@Service`）
2. **Controller** - 客户端单例（`@Controller`）
3. **Manager** - 共享单例（`@Dependency`）

## ⚠️ 重要原则：使用依赖注入

**单例之间必须使用依赖注入，禁止直接导入！**

```typescript
// ❌ 禁止：直接导入单例
import { PlayerService } from "./player-service";
const playerService = new PlayerService(); // 错误！

// ✅ 正确：使用依赖注入
@Service()
export class GameService {
    constructor(
        private readonly playerService: PlayerService // 通过构造函数注入
    ) {}
}
```

## Service（服务端单例）

### 基础示例

```typescript
@Service()
export class PlayerDataService implements OnInit {
    constructor(
        private readonly logger: Logger,
        private readonly dataStore: DataStore // 依赖注入其他服务
    ) {}

    onInit(): void {
        this.logger.Info("PlayerDataService initialized");
    }
}
```

### 实现接口模式

服务可以实现特定接口来处理生命周期事件或系统事件：

```typescript
import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import type { ServerStore } from "server/store/types";
import type { OnPlayerJoin } from "./player-service";

@Service({})
export class PlayerBadgeService implements OnPlayerJoin {
    constructor(
        private readonly logger: Logger,
        private readonly store: ServerStore,
    ) {}

    // 实现接口方法
    public onPlayerJoin(playerEntity: PlayerEntity): void {
        const { userId } = playerEntity;

        this.awardBadge(playerEntity, Badge.Welcome).catch(err => {
            this.logger.Error(`Failed to check if ${userId} has badge ${Badge.Welcome}: ${err}`);
        });

        this.awardUnrewardedBadges(playerEntity).catch(err => {
            this.logger.Error(`Failed to award unrewarded badges to ${userId}: ${err}`);
        });
    }

    // 公开方法
    public async awardBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
        const hasBadge = await this.checkIfPlayerHasBadge(playerEntity, badge);
        if (hasBadge) {
            return;
        }

        return this.giveBadge(playerEntity, badge);
    }

    // 私有方法
    private async giveBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
        // 实现细节
    }
}
```

**职责**：数据持久化、业务逻辑、状态管理、事件处理


## Controller（客户端单例）

```typescript
@Controller()
export class InputController implements OnStart {
    constructor(
        private readonly logger: Logger,
        private readonly soundController: SoundController // 依赖注入其他控制器
    ) {}

    onStart(): void {
        this.setupInputHandlers();
    }
}
```

**职责**：UI 管理、输入处理、客户端逻辑


## Manager（共享单例）

```typescript
// shared/managers/config-manager.ts
@Dependency()
export class ConfigManager {
    constructor(
        private readonly logger: Logger // 可以注入其他依赖
    ) {}

    getConfig<T>(name: string): T | undefined {
        // 配置获取逻辑
    }
}
```

**职责**：配置管理、工具函数、共享算法


## 依赖注入示例

```typescript
// ✅ 正确：通过构造函数注入依赖
@Service()
export class BattleService {
    constructor(
        private readonly playerService: PlayerDataService,  // Service 注入 Service
        private readonly calculator: CombatCalculator       // Service 注入 Manager
    ) {}
}

@Controller()
export class GameController {
    constructor(
        private readonly uiController: UIController,        // Controller 注入 Controller
        private readonly configManager: ConfigManager       // Controller 注入 Manager
    ) {}
}
```

## 生命周期

**初始化顺序**：依赖注入 → OnInit → OnStart

```typescript
// 使用 loadOrder 控制初始化顺序
@Service({ loadOrder: 1 })
export class ConfigService implements OnInit {
    onInit(): void {
        print("1. Config service ready");
    }
}

@Service({ loadOrder: 2 })
export class GameService implements OnInit {
    constructor(private readonly configService: ConfigService) {}
    
    onInit(): void {
        print("2. Game service ready");
    }
}
```

## 错误处理

### 基础错误处理

```typescript
@Service()
export class SafeService {
    constructor(private readonly logger: Logger) {}

    async riskyOperation(): Promise<void> {
        try {
            // 执行操作
        } catch (error) {
            this.logger.Error("Operation failed", { error });
            // 优雅降级
        }
    }
}
```

### 使用 pcall 处理 Roblox API

```typescript
@Service()
export class PlayerBadgeService {
    constructor(private readonly logger: Logger) {}

    private async giveBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
        const { player, userId } = playerEntity;

        // 使用 pcall 捕获 Roblox API 可能的错误
        const [success, awarded] = pcall(() =>
            BadgeService.AwardBadge(player.UserId, tonumber(badge)),
        );
        
        if (!success) {
            throw awarded; // 抛出错误
        }

        if (!awarded) {
            this.logger.Warn(`Awarded badge ${badge} to ${userId} but it was not successful.`);
        } else {
            this.logger.Info(`Awarded badge ${badge} to ${userId}`);
        }
    }
}
```

### Promise 错误处理

```typescript
@Service()
export class AsyncService {
    constructor(private readonly logger: Logger) {}

    public async awardBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
        const hasBadge = await this.checkIfPlayerHasBadge(playerEntity, badge);
        if (hasBadge) {
            return;
        }

        return this.giveBadge(playerEntity, badge);
    }

    // 在调用方处理错误
    public onPlayerJoin(playerEntity: PlayerEntity): void {
        this.awardBadge(playerEntity, Badge.Welcome).catch(err => {
            this.logger.Error(`Failed to award badge: ${err}`);
        });
    }
}
```

## 测试单例

```typescript
// player-service.jack.ts
describe("PlayerDataService", () => {
    let service: PlayerDataService;
    let mockLogger: jest.Mocked<Logger>;

    beforeEach(() => {
        mockLogger = { Info: jest.fn() } as jest.Mocked<Logger>;
        service = new PlayerDataService(mockLogger); // 手动创建实例
    });

    it("should handle player data", () => {
        const data = { level: 1 };
        service.savePlayerData(123, data);
        expect(service.getPlayerData(123)).toEqual(data);
    });
});
```

## 最佳实践

### 1. 单一职责
```typescript
// ✅ 每个单例只负责一个领域
@Service()
export class InventoryService {
    // 只处理背包逻辑
}

// ❌ 避免万能服务
@Service()
export class GameService {
    // 处理所有投戏逻辑 - 错误！
}
```

### 2. 避免循环依赖
```typescript
// ❌ 循环依赖
@Service()
export class ServiceA {
    constructor(private serviceB: ServiceB) {}
}
@Service()
export class ServiceB {
    constructor(private serviceA: ServiceA) {} // 错误！
}
```

### 3. 状态管理
```typescript
@Service()
export class StateService {
    private readonly config = { ... } as const;     // 不可变
    private mutableState = new Map<string, any>();  // 可变
    
    // 提供只读访问
    getState(): ReadonlyMap<string, any> {
        return this.mutableState;
    }
}
```

### 4. 禁止静态方法

- 所有单例必须以对象方式提供接口, 禁止提供静态方法.
- 禁止直接访问其他单例的静态方法.

### 5. Store 访问模式

对于使用 Store 的服务，正确的访问模式：

```typescript
@Service()
export class PlayerBadgeService {
    constructor(
        private readonly logger: Logger,
        private readonly store: ServerStore,  // 注入 Store
    ) {}

    public async checkIfPlayerHasBadge(
        { player, userId }: PlayerEntity,
        badge: Badge,
    ): Promise<boolean> {
        // 使用 getState 和 selector 读取状态
        const hasBadge = this.store.getState(selectPlayerAchievements(userId))?.badges.get(badge);
        if (hasBadge !== undefined) {
            return true;
        }

        // 如果本地状态没有，查询远程服务
        return Promise.try(() => BadgeService.UserHasBadgeAsync(player.UserId, tonumber(badge)));
    }

    private async giveBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
        const { userId } = playerEntity;
        
        // 业务逻辑处理...
        
        // 通过 Store 的方法更新状态
        this.store.awardBadge(userId, badge, awarded);
    }
}
```

### 6. 方法可见性

合理使用方法可见性修饰符：

```typescript
@Service()
export class PlayerService {
    // 公开方法 - 供其他服务调用
    public async getPlayerEntity(player: Player): PlayerEntity | undefined {
        // ...
    }

    // 受保护方法 - 供子类使用
    protected handlePlayerData(data: PlayerData): void {
        // ...
    }

    // 私有方法 - 仅内部使用
    private validatePlayerData(data: unknown): data is PlayerData {
        // ...
    }
}
```
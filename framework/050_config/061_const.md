# 常量定义与管理

## 概述

常量管理是 roblox-ts 框架项目中的基础设施，负责定义和管理全局常量、配置值和系统参数。合理的常量管理可以提高代码的可维护性、可读性和类型安全性。

## 常量分类

### 1. 系统常量

系统级别的常量定义，通常在 `src/shared/constants/` 目录下：

```typescript
// src/shared/constants/constants.ts
import { RunService } from "@rbxts/services";
import Signal from "@rbxts/signal";

export const GAME_NAME = "Template for roblox-ts";
export const IS_EDIT = RunService.IsStudio() && \!RunService.IsRunning();
export const FlameworkIgnited = new Signal();
```

### 2. 客户端常量

客户端特定的常量，位于 `src/client/constants/` 目录：

```typescript
// src/client/constants/index.ts
import { Players } from "@rbxts/services";

export const { LocalPlayer } = Players;
export const USER_ID = tostring(LocalPlayer.UserId);
export const USER_NAME = LocalPlayer.Name;
export const PLAYER_GUI = LocalPlayer.FindFirstChildWhichIsA("PlayerGui")\!;
```

### 3. 配置常量

来自 Luban 配置系统的常量，通过配置文件定义：

```typescript
// 通过配置系统定义的常量
export const GAME_CONFIG = {
    MAX_PLAYERS: 12,
    STARTING_GOLD: 100,
    STARTING_ENERGY: 50,
    WAVE_INTERVAL: 30,
    ENEMY_SPAWN_RATE: 1.5,
    MAX_ENEMIES: 50,
} as const;
```

### 4. 业务常量

特定业务模块的常量定义：

```typescript
// src/server/services/shop/helpers/shop-constants.ts
export const SHOP_CONSTANTS = {
    REFRESH_INTERVAL: 24 * 60 * 60, // 24小时
    MAX_ITEMS_PER_CATEGORY: 10,
    DISCOUNT_RATE: 0.1,
} as const;

// src/client/ui/constants/springs.ts
export const UI_SPRINGS = {
    GENTLE: { frequency: 4, dampingRatio: 0.5 },
    RESPONSIVE: { frequency: 6, dampingRatio: 0.8 },
    BOUNCY: { frequency: 8, dampingRatio: 0.3 },
} as const;
```

## 常量定义模式

### 1. 基础常量

```typescript
// 简单值常量
export const MAX_HEALTH = 100;
export const DEFAULT_SPEED = 16;
export const GAME_VERSION = "1.0.0";

// 使用 as const 确保类型推断
export const ITEM_TYPES = ["weapon", "armor", "consumable"] as const;
export const RARITY_COLORS = {
    common: Color3.fromRGB(255, 255, 255),
    rare: Color3.fromRGB(0, 255, 0),
    epic: Color3.fromRGB(255, 0, 255),
    legendary: Color3.fromRGB(255, 165, 0),
} as const;
```

### 2. 计算常量

```typescript
// 基于其他常量计算的值
export const BASE_DAMAGE = 10;
export const CRITICAL_MULTIPLIER = 2;
export const CRITICAL_DAMAGE = BASE_DAMAGE * CRITICAL_MULTIPLIER;

// 环境检测常量
export const IS_STUDIO = RunService.IsStudio();
export const IS_RUNNING = RunService.IsRunning();
export const IS_EDIT_MODE = IS_STUDIO && \!IS_RUNNING;
```

### 3. 枚举常量

```typescript
// 使用枚举定义相关常量
export enum GameState {
    Loading = "loading",
    Menu = "menu",
    Playing = "playing",
    Paused = "paused",
    GameOver = "game_over",
}

// 或使用对象形式
export const CURRENCY_TYPES = {
    GOLD: "gold",
    GEM: "gem",
    ENERGY: "energy",
} as const;

export type CurrencyType = typeof CURRENCY_TYPES[keyof typeof CURRENCY_TYPES];
```

### 4. 配置对象常量

```typescript
// 复杂配置对象
export const BATTLE_CONFIG = {
    WAVE: {
        INTERVAL: 30,
        MAX_ENEMIES: 50,
        SPAWN_RATE: 1.5,
    },
    PLAYER: {
        MAX_HEALTH: 100,
        STARTING_LEVEL: 1,
        MAX_LEVEL: 100,
    },
    REWARDS: {
        BASE_EXP: 10,
        LEVEL_MULTIPLIER: 1.2,
        BONUS_CHANCE: 0.1,
    },
} as const;
```

## 常量组织策略

### 1. 按作用域分类

```typescript
// src/shared/constants/index.ts - 全局常量入口
export * from "./game";
export * from "./ui";
export * from "./battle";
export * from "./shop";

// src/shared/constants/game.ts - 游戏核心常量
export const GAME_CONSTANTS = {
    NAME: "Death Subway",
    VERSION: "1.0.0",
    MAX_PLAYERS: 12,
} as const;

// src/shared/constants/ui.ts - UI相关常量
export const UI_CONSTANTS = {
    ANIMATION_SPEED: 0.3,
    FADE_DURATION: 0.5,
    PANEL_SIZES: {
        SMALL: new UDim2(0, 300, 0, 200),
        MEDIUM: new UDim2(0, 500, 0, 400),
        LARGE: new UDim2(0, 800, 0, 600),
    },
} as const;
```

### 2. 按功能分组

```typescript
// src/shared/constants/gameplay.ts
export const GAMEPLAY_CONSTANTS = {
    COMBAT: {
        BASE_DAMAGE: 10,
        CRIT_CHANCE: 0.05,
        CRIT_MULTIPLIER: 2.0,
    },
    LEVELING: {
        BASE_EXP: 100,
        EXP_MULTIPLIER: 1.5,
        MAX_LEVEL: 100,
    },
    INVENTORY: {
        MAX_SLOTS: 50,
        STACK_SIZE: 999,
        SORT_TYPES: ["name", "rarity", "type"] as const,
    },
} as const;
```

### 3. 类型安全的常量

```typescript
// 使用类型约束确保常量正确性
export const VALID_ITEM_TYPES = [
    "weapon",
    "armor", 
    "consumable",
    "material",
    "quest",
] as const;

export type ItemType = typeof VALID_ITEM_TYPES[number];

// 运行时验证
export function isValidItemType(type: string): type is ItemType {
    return VALID_ITEM_TYPES.includes(type as ItemType);
}
```

## 最佳实践

### 1. 命名约定

```typescript
// ✅ 使用 SCREAMING_SNAKE_CASE 表示常量
export const MAX_PLAYERS = 12;
export const DEFAULT_SPAWN_POINT = new Vector3(0, 10, 0);

// ✅ 使用 PascalCase 表示常量对象
export const GameSettings = {
    MaxHealth: 100,
    DefaultSpeed: 16,
} as const;

// ❌ 避免使用 camelCase 表示常量
export const maxPlayers = 12; // 不推荐
```

### 2. 类型安全

```typescript
// ✅ 使用 as const 确保类型推断
export const RARITY_LEVELS = ["common", "rare", "epic"] as const;
export type RarityLevel = typeof RARITY_LEVELS[number];

// ✅ 使用 readonly 标记只读属性
export const GAME_CONFIG: Readonly<{
    maxPlayers: number;
    waveInterval: number;
}> = {
    maxPlayers: 12,
    waveInterval: 30,
};

// ❌ 避免可变的常量
export const MUTABLE_CONFIG = {
    maxPlayers: 12, // 可以被修改
};
```

### 3. 文档化

```typescript
/**
 * 游戏核心配置常量
 * 
 * @remarks
 * 这些常量定义了游戏的基础参数，修改时需要考虑平衡性
 */
export const GAME_BALANCE = {
    /** 玩家初始生命值 */
    INITIAL_HEALTH: 100,
    
    /** 每级生命值增长 */
    HEALTH_PER_LEVEL: 10,
    
    /** 基础移动速度 */
    BASE_SPEED: 16,
    
    /** 攻击力基础值 */
    BASE_ATTACK: 10,
} as const;
```

### 4. 环境相关常量

```typescript
// 环境检测常量
export const ENVIRONMENT = {
    IS_STUDIO: RunService.IsStudio(),
    IS_RUNNING: RunService.IsRunning(),
    IS_EDIT: RunService.IsStudio() && \!RunService.IsRunning(),
    IS_PRODUCTION: \!RunService.IsStudio(),
} as const;

// 基于环境的配置
export const DEBUG_CONFIG = {
    ENABLE_LOGGING: ENVIRONMENT.IS_STUDIO,
    SHOW_DEBUG_UI: ENVIRONMENT.IS_EDIT,
    SKIP_INTRO: ENVIRONMENT.IS_STUDIO,
} as const;
```

## 与配置系统集成

### 1. 从 Luban 配置生成常量

```typescript
// 从配置系统读取常量
export function createGameConstants(config: GameConfig) {
    return {
        MAX_PLAYERS: config.maxPlayers,
        WAVE_INTERVAL: config.waveInterval,
        STARTING_GOLD: config.startingGold,
    } as const;
}

// 在服务中使用
@Service()
export class GameService {
    private readonly constants = createGameConstants(gameConfig);
    
    public getMaxPlayers(): number {
        return this.constants.MAX_PLAYERS;
    }
}
```

### 2. 常量验证

```typescript
// 常量验证函数
export function validateConstants(): boolean {
    const checks = [
        () => MAX_PLAYERS > 0,
        () => WAVE_INTERVAL > 0,
        () => BASE_DAMAGE > 0,
    ];
    
    return checks.every(check => check());
}

// 在服务初始化时验证
@Service()
export class ValidationService implements OnInit {
    public onInit(): void {
        if (\!validateConstants()) {
            error("Constants validation failed\!");
        }
    }
}
```

## 常量测试

### 1. 单元测试

```typescript
// __tests__/constants.jack.ts
describe("Constants", () => {
    it("should have valid max players", () => {
        expect(MAX_PLAYERS).toBeGreaterThan(0);
        expect(MAX_PLAYERS).toBeLessThanOrEqual(50);
    });
    
    it("should have consistent damage values", () => {
        expect(CRITICAL_DAMAGE).toBe(BASE_DAMAGE * CRITICAL_MULTIPLIER);
    });
    
    it("should have proper type inference", () => {
        const rarities: RarityLevel[] = ["common", "rare"];
        expect(rarities).toContain("common");
    });
});
```

### 2. 类型测试

```typescript
// 类型安全测试
describe("Constant Types", () => {
    it("should maintain type safety", () => {
        // 编译时检查
        const validRarity: RarityLevel = "common"; // ✅
        // const invalidRarity: RarityLevel = "invalid"; // ❌ 编译错误
        
        expect(validRarity).toBe("common");
    });
});
```

## 注意事项

1. **不可变性**: 使用 `as const` 和 `readonly` 确保常量不被修改
2. **类型安全**: 充分利用 TypeScript 类型系统进行约束
3. **文档化**: 为复杂常量提供清晰的注释和文档
4. **测试**: 对关键常量进行单元测试验证
5. **环境感知**: 根据运行环境动态调整常量值

## 相关文档

- [配置管理系统](060_config.md) - 系统配置管理
- [Luban Bean](062_luban_bean.md) - 配置数据结构
- [类型系统](../030_type-system.md) - TypeScript 类型管理

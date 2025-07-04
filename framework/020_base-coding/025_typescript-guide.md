# TypeScript 使用指南

本指南介绍在本框架中使用 TypeScript 类型系统的最佳实践和高级技巧。通过充分利用 TypeScript 的类型系统，您可以编写出更安全、更易维护的代码。

## 基础类型定义

### 1. 接口与类型别名

项目中定义类型时，遵循以下原则：

- 使用`interface`定义对象结构，特别是可能被扩展的API
  ```typescript
  export interface FrameProps<T extends Instance = Frame> extends React.PropsWithChildren {
    CornerRadius?: BindingValue<UDim>;
    Native?: Partial<React.InstanceProps<T>>;
  }
  ```

- 使用`type`定义复杂类型、联合类型或交叉类型
  ```typescript
  type RemScaleMode = "pixel" | "unit";
  
  type PlayerEntityId = string | number;
  ```

- 为了一致性，组件Props统一使用`interface`定义并以`Props`结尾
  ```typescript
  export interface ButtonProps extends FrameProps<TextButton> {
    Native?: Partial<React.InstanceProps<TextButton>>;
    onClick?: () => void;
  }
  ```

### 2. 命名约定

- 类型名使用PascalCase命名法
  ```typescript
  interface PlayerData {}
  type GameState = "lobby" | "playing" | "ended";
  ```

- 类型参数（泛型）使用单个大写字母或描述性PascalCase名称
  ```typescript
  function createStore<T>() {}
  function createEntity<EntityType extends BaseEntity>() {}
  ```

- 工具类型使用描述性名称，表明其用途
  ```typescript
  type UndefinedToOptional<T> = { ... }
  type ReadonlyDeep<T> = { ... }
  ```

### 3. 声明文件

- 类型定义使用`.d.ts`后缀，位于`src/types`目录
- 基础类型定义放在`src/types/interfaces`目录
- 工具类型定义放在`src/types/util`目录
- 枚举类型定义放在`src/types/enum`目录

```typescript
// src/types/enum/kick-reason.d.ts
declare const enum KickCode {
  PlayerProfileUndefined,
  PlayerProfileReleased,
  PlayerInstantiationError,
  PlayerFullServer,
}

export default KickCode;
```

## 高级类型技术

### 1. 泛型

泛型用于创建可重用的组件和函数，可处理多种类型：

- 使用泛型约束限制泛型参数的范围
  ```typescript
  export interface FrameProps<T extends Instance = Frame> extends React.PropsWithChildren {
    // 属性定义
  }
  ```

- 使用泛型默认类型提供合理的默认值
  ```typescript
  function createCache<T = string>() {
    // 实现
  }
  ```

- 使用多泛型参数定义复杂类型关系
  ```typescript
  function createEntity<T, U>(data: T, options: U) {
    // 实现
  }
  ```

### 2. 条件类型

使用条件类型创建基于条件的类型转换：

```typescript
type ExtractPlayerData<T> = T extends { playerData: infer U } ? U : never;

type NonNullableProps<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
```

### 3. 映射类型与索引访问类型

使用映射类型转换现有类型的属性：

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};
```

使用索引访问类型提取嵌套属性类型：

```typescript
type PlayerName = PlayerEntity['name'];
type ComponentProps = React.ComponentProps<typeof Button>;
```

## 工具类型

### 1. 内置工具类型

项目中充分利用TypeScript内置的工具类型：

- `Partial<T>` - 使所有属性可选
- `Required<T>` - 使所有属性必需
- `Readonly<T>` - 使所有属性只读
- `Record<K, T>` - 创建具有指定键和值类型的对象类型
- `Pick<T, K>` - 从类型中选择特定属性
- `Omit<T, K>` - 从类型中排除特定属性
- `NonNullable<T>` - 从类型中排除null和undefined

### 2. 自定义工具类型

项目中定义了一些常用的自定义工具类型：

```typescript
// 将undefined属性转换为可选属性
type UndefinedToOptional<T> = {
  [K in keyof T]-?: (
    x: undefined extends T[K] ? Partial<Record<K, T[K]>> : Record<K, T[K]>,
  ) => void;
}[keyof T] extends (x: infer I) => void
  ? I extends infer U
    ? { [K in keyof U]: U[K] }
    : never
  : never;

// 深度只读类型
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P];
};
```

### 3. 实用工具类型

为特定场景定义实用工具类型：

```typescript
// 组件属性类型
type PropsWithClassName<P = {}> = P & { className?: string };

// 服务依赖类型
type ServiceDependencies<T> = {
  [K in keyof T]: T[K] extends Service<infer U> ? U : never;
};
```

## Roblox特定类型

### 1. Roblox实例类型

处理Roblox实例时的类型定义：

```typescript
type RobloxInstance<T extends keyof Instances> = Instances[T];
type AnyRobloxInstance = RobloxInstance<keyof Instances>;
```

### 2. Roblox事件类型

处理Roblox事件的类型定义：

```typescript
type RobloxEvent<T> = RBXScriptSignal & {
  Connect(callback: (arg: T) => void): RBXScriptConnection;
};

type PlayerEvent = RobloxEvent<Player>;
```

### 3. Luau互操作类型

处理Luau和TypeScript互操作的类型定义：

```typescript
// 表示一个可能是Promise的值
type MaybePromise<T> = T | Promise<T>;

// 表示一个支持迭代的Luau表
interface LuauTable<K, V> {
  [index: number]: V;
  size(): number;
}
```

## 类型安全模式

### 1. 严格空值检查

- 启用严格空值检查，处理null和undefined
- 使用非空断言操作符（!）仅在确定不为空的情况下
- 优先使用可选链和空值合并而非非空断言

```typescript
// 推荐
const name = player?.Name ?? "Unknown";

// 不推荐，除非绝对确定
const name = player!.Name;
```

### 2. 类型收窄

使用类型守卫和类型断言正确收窄类型：

```typescript
// 使用类型谓词函数
function isPlayerEntity(entity: unknown): entity is PlayerEntity {
  return entity instanceof PlayerEntity;
}

// 使用in操作符
function processEntity(entity: PlayerEntity | NPCEntity) {
  if ("userId" in entity) {
    // entity类型已被收窄为PlayerEntity
  } else {
    // entity类型已被收窄为NPCEntity
  }
}
```

### 3. 类型断言

谨慎使用类型断言，仅在确定类型的情况下使用：

```typescript
// 仅在确定类型时使用as
const button = element as TextButton;

// 优先使用类型守卫
if (element.IsA("TextButton")) {
  const button = element;
  // 此处button已被推断为TextButton类型
}
```

## 网络通信类型

### 1. 定义远程事件类型

使用接口明确定义网络通信类型：

```typescript
interface ClientToServerEvents {
  store: {
    start: () => void;
  };
  player: {
    requestData: (userId: number) => void;
  };
}

interface ServerToClientEvents {
  store: {
    dispatch: (actions: Array<BroadcastAction>) => void;
    hydrate: (state: SerializedSharedState) => void;
  };
}
```

### 2. 类型安全的网络通信

使用Flamework的Networking创建类型安全的网络通信：

```typescript
export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<
  ClientToServerFunctions,
  ServerToClientFunctions
>();
```

## 状态管理类型

### 1. Redux状态类型

定义类型安全的Redux状态和操作：

```typescript
// 状态类型
interface AppState {
  user: UserState;
  game: GameState;
}

// 操作类型
type AppAction = 
  | { type: "USER_LOGIN", payload: UserData }
  | { type: "GAME_START", payload: GameConfig }
  | { type: "GAME_END", payload: GameResult };
```

### 2. 持久状态类型

定义持久化状态类型：

```typescript
export interface PlayerData {
  settings: PlayerSettings;
  stats: PlayerStats;
  inventory: PlayerInventory;
}

export interface PlayerSettings {
  soundVolume: number;
  musicVolume: number;
  cameraSpeed: number;
}
```

## 类型文档

### 1. 类型注释

为类型定义添加详细注释：

```typescript
/**
 * 表示玩家的游戏设置。
 * 这些设置会被持久化，在玩家下次进入游戏时恢复。
 */
export interface PlayerSettings {
  /** 音效音量，范围0-1 */
  soundVolume: number;
  /** 音乐音量，范围0-1 */
  musicVolume: number;
  /** 相机旋转速度，默认为1 */
  cameraSpeed: number;
}
```

### 2. 示例与最佳实践

在注释中提供类型使用示例：

```typescript
/**
 * 创建一个新的玩家实体。
 * 
 * @example
 * ```ts
 * const playerEntity = new PlayerEntity(player, janitor, document);
 * ```
 */
export class PlayerEntity { /* ... */ }
```

## 类型迁移与兼容性

### 1. 逐步类型化

对旧代码进行渐进式类型增强：

- 首先使用`any`类型快速迁移
- 然后逐步替换为更精确的类型
- 最后使用完全类型化的代码

### 2. 类型兼容性

处理Roblox API和第三方库的类型兼容：

- 使用声明合并扩展现有类型
- 为缺少类型定义的API创建类型定义
- 使用模块声明为未类型化的库提供类型

```typescript
// 扩展Roblox类型
declare global {
  interface Part {
    customProperty: string;
  }
}

// 为第三方库创建类型
declare module "untyped-library" {
  export function someFunction(): void;
  export const someConstant: number;
}
```

## 调试类型问题

### 1. 类型断言函数

创建辅助函数帮助调试类型问题：

```typescript
function assertType<T>(value: any, _typeRef?: T): asserts value is T {
  // 仅在开发环境下进行运行时检查
  if (process.env.NODE_ENV !== "production") {
    // 实现类型检查逻辑
  }
}
```

### 2. 类型日志

使用条件类型和never类型检测意外类型：

```typescript
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends null ? "null" :
  "object";

// 使用示例
type T0 = TypeName<string>; // "string"
type T1 = TypeName<number>; // "number"
```

## 示例：完整的类型定义

以下是一个完整的类型定义示例，展示了多种类型技术的应用：

```typescript
/**
 * 表示游戏中的实体对象。
 * 可以是玩家控制的角色或NPC。
 */
export interface Entity {
  /** 实体的唯一标识符 */
  id: string;
  /** 实体的位置 */
  position: Vector3;
  /** 实体的朝向 */
  orientation: CFrame;
  /** 实体的健康状态 */
  health: number;
  /** 最大健康值 */
  maxHealth: number;
}

/**
 * 表示玩家控制的实体。
 * 扩展了基础实体接口，添加了玩家特定属性。
 */
export interface PlayerEntity extends Entity {
  /** 关联的玩家对象 */
  player: Player;
  /** 玩家的用户ID */
  userId: number;
  /** 玩家数据 */
  data: PlayerData;
}

/**
 * 表示非玩家角色。
 * 扩展了基础实体接口，添加了NPC特定属性。
 */
export interface NPCEntity extends Entity {
  /** NPC的行为类型 */
  behavior: "passive" | "neutral" | "aggressive";
  /** NPC的对话数据 */
  dialogue?: DialogueData;
}

/**
 * 实体管理器类型。
 * 管理游戏中的所有实体。
 */
export type EntityManager<T extends Entity = Entity> = {
  /** 添加实体到管理器 */
  add(entity: T): void;
  /** 从管理器中移除实体 */
  remove(id: string): boolean;
  /** 获取指定ID的实体 */
  get(id: string): T | undefined;
  /** 获取所有实体 */
  getAll(): Array<T>;
  /** 根据谓词函数过滤实体 */
  filter(predicate: (entity: T) => boolean): Array<T>;
};

/**
 * 创建实体管理器的工厂函数。
 * @returns 新的实体管理器实例
 */
export function createEntityManager<T extends Entity>(): EntityManager<T> {
  const entities = new Map<string, T>();
  
  return {
    add(entity: T) {
      entities.set(entity.id, entity);
    },
    remove(id: string) {
      return entities.delete(id);
    },
    get(id: string) {
      return entities.get(id);
    },
    getAll() {
      return Array.from(entities.values());
    },
    filter(predicate: (entity: T) => boolean) {
      return Array.from(entities.values()).filter(predicate);
    }
  };
}

/**
 * 类型谓词函数：检查实体是否为玩家实体。
 */
export function isPlayerEntity(entity: Entity): entity is PlayerEntity {
  return "userId" in entity && "player" in entity;
}

/**
 * 类型谓词函数：检查实体是否为NPC实体。
 */
export function isNPCEntity(entity: Entity): entity is NPCEntity {
  return "behavior" in entity;
}
```

## 游戏开发特定类型模式

### 1. 状态机类型

为游戏状态机定义类型安全的状态转换：

```typescript
// 游戏状态枚举
enum GameState {
    MainMenu = "mainMenu",
    Loading = "loading",
    Playing = "playing",
    Paused = "paused",
    GameOver = "gameOver"
}

// 状态转换映射
type StateTransitions = {
    [GameState.MainMenu]: GameState.Loading;
    [GameState.Loading]: GameState.Playing;
    [GameState.Playing]: GameState.Paused | GameState.GameOver;
    [GameState.Paused]: GameState.Playing | GameState.MainMenu;
    [GameState.GameOver]: GameState.MainMenu;
};

// 状态机类型
interface StateMachine<TState extends string> {
    currentState: TState;
    canTransitionTo<TTarget extends StateTransitions[TState]>(
        targetState: TTarget
    ): boolean;
    transitionTo<TTarget extends StateTransitions[TState]>(
        targetState: TTarget
    ): void;
}

// 使用示例
class GameStateMachine implements StateMachine<GameState> {
    constructor(public currentState: GameState = GameState.MainMenu) {}

    public canTransitionTo<TTarget extends StateTransitions[GameState]>(
        targetState: TTarget
    ): boolean {
        // 实现状态转换验证逻辑
        return true;
    }

    public transitionTo<TTarget extends StateTransitions[GameState]>(
        targetState: TTarget
    ): void {
        if (this.canTransitionTo(targetState)) {
            this.currentState = targetState;
        }
    }
}
```

### 2. 事件系统类型

类型安全的事件系统：

```typescript
// 事件映射类型
interface GameEventMap {
    playerJoin: { player: Player; timestamp: number };
    playerLeave: { playerId: number; reason: string };
    itemPickup: { playerId: number; itemId: string; quantity: number };
    battleStart: { attackerId: number; defenderId: number };
    battleEnd: { winnerId: number; loserId: number; damage: number };
}

// 事件监听器类型
type EventListener<T> = (data: T) => void;

// 事件发射器接口
interface EventEmitter<TEventMap> {
    on<K extends keyof TEventMap>(
        event: K,
        listener: EventListener<TEventMap[K]>
    ): void;
    
    off<K extends keyof TEventMap>(
        event: K,
        listener: EventListener<TEventMap[K]>
    ): void;
    
    emit<K extends keyof TEventMap>(
        event: K,
        data: TEventMap[K]
    ): void;
}

// 实现示例
class GameEventEmitter implements EventEmitter<GameEventMap> {
    private listeners = new Map<keyof GameEventMap, Set<EventListener<any>>>();

    public on<K extends keyof GameEventMap>(
        event: K,
        listener: EventListener<GameEventMap[K]>
    ): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
    }

    public off<K extends keyof GameEventMap>(
        event: K,
        listener: EventListener<GameEventMap[K]>
    ): void {
        this.listeners.get(event)?.delete(listener);
    }

    public emit<K extends keyof GameEventMap>(
        event: K,
        data: GameEventMap[K]
    ): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            for (const listener of eventListeners) {
                listener(data);
            }
        }
    }
}
```

### 3. 配置系统类型

为游戏配置创建类型安全的访问器：

```typescript
// 配置结构类型
interface GameConfig {
    player: {
        maxHealth: number;
        moveSpeed: number;
        jumpPower: number;
    };
    combat: {
        baseDamage: number;
        criticalChance: number;
        criticalMultiplier: number;
    };
    ui: {
        fadeInDuration: number;
        fadeOutDuration: number;
        buttonClickSound: string;
    };
}

// 配置路径类型
type ConfigPath<T, K extends keyof T = keyof T> = K extends string
    ? T[K] extends Record<string, any>
        ? `${K}.${ConfigPath<T[K]>}`
        : K
    : never;

// 配置值类型
type ConfigValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
        ? ConfigValue<T[K], Rest>
        : never
    : P extends keyof T
        ? T[P]
        : never;

// 配置管理器
class TypeSafeConfigManager<T> {
    constructor(private config: T) {}

    public get<P extends ConfigPath<T>>(path: P): ConfigValue<T, P> {
        const keys = path.split('.') as Array<keyof any>;
        let current: any = this.config;
        
        for (const key of keys) {
            current = current[key];
        }
        
        return current;
    }

    public set<P extends ConfigPath<T>>(
        path: P,
        value: ConfigValue<T, P>
    ): void {
        const keys = path.split('.') as Array<keyof any>;
        let current: any = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    }
}

// 使用示例
const configManager = new TypeSafeConfigManager<GameConfig>({
    player: {
        maxHealth: 100,
        moveSpeed: 16,
        jumpPower: 50
    },
    combat: {
        baseDamage: 10,
        criticalChance: 0.1,
        criticalMultiplier: 1.5
    },
    ui: {
        fadeInDuration: 0.5,
        fadeOutDuration: 0.3,
        buttonClickSound: "click.wav"
    }
});

// 类型安全的配置访问
const maxHealth = configManager.get("player.maxHealth"); // number
const fadeIn = configManager.get("ui.fadeInDuration"); // number
```

### 4. 组件系统类型

ECS（Entity-Component-System）架构的类型定义：

```typescript
// 组件基类
abstract class Component {
    public abstract readonly componentType: string;
}

// 具体组件类型
class PositionComponent extends Component {
    public readonly componentType = "position";
    constructor(public x: number, public y: number, public z: number) {
        super();
    }
}

class HealthComponent extends Component {
    public readonly componentType = "health";
    constructor(public current: number, public maximum: number) {
        super();
    }
}

class VelocityComponent extends Component {
    public readonly componentType = "velocity";
    constructor(public dx: number, public dy: number, public dz: number) {
        super();
    }
}

// 组件类型映射
interface ComponentTypeMap {
    position: PositionComponent;
    health: HealthComponent;
    velocity: VelocityComponent;
}

// 实体类型
class Entity {
    private components = new Map<string, Component>();

    public addComponent<T extends keyof ComponentTypeMap>(
        component: ComponentTypeMap[T]
    ): void {
        this.components.set(component.componentType, component);
    }

    public getComponent<T extends keyof ComponentTypeMap>(
        type: T
    ): ComponentTypeMap[T] | undefined {
        return this.components.get(type) as ComponentTypeMap[T] | undefined;
    }

    public hasComponent<T extends keyof ComponentTypeMap>(type: T): boolean {
        return this.components.has(type);
    }

    public removeComponent<T extends keyof ComponentTypeMap>(type: T): void {
        this.components.delete(type);
    }
}

// 系统基类
abstract class System<T extends keyof ComponentTypeMap = any> {
    protected requiredComponents: T[] = [];

    public abstract update(entities: Entity[], deltaTime: number): void;

    protected getEntitiesWithComponents(entities: Entity[]): Entity[] {
        return entities.filter(entity =>
            this.requiredComponents.every(componentType =>
                entity.hasComponent(componentType)
            )
        );
    }
}

// 具体系统实现
class MovementSystem extends System<"position" | "velocity"> {
    protected requiredComponents = ["position", "velocity"] as const;

    public update(entities: Entity[], deltaTime: number): void {
        const movableEntities = this.getEntitiesWithComponents(entities);

        for (const entity of movableEntities) {
            const position = entity.getComponent("position")!;
            const velocity = entity.getComponent("velocity")!;

            position.x += velocity.dx * deltaTime;
            position.y += velocity.dy * deltaTime;
            position.z += velocity.dz * deltaTime;
        }
    }
}
```

### 5. 数据验证类型

运行时类型验证和编译时类型安全：

```typescript
// 验证规则类型
interface ValidationRule<T> {
    validate(value: unknown): value is T;
    errorMessage: string;
}

// 基础验证器
const isString: ValidationRule<string> = {
    validate: (value): value is string => typeof value === "string",
    errorMessage: "Expected string"
};

const isNumber: ValidationRule<number> = {
    validate: (value): value is number => typeof value === "number",
    errorMessage: "Expected number"
};

const isPositiveNumber: ValidationRule<number> = {
    validate: (value): value is number => 
        typeof value === "number" && value > 0,
    errorMessage: "Expected positive number"
};

// 对象验证器
interface ObjectValidator<T> {
    [K in keyof T]: ValidationRule<T[K]>;
}

function createObjectValidator<T>(
    schema: ObjectValidator<T>
): ValidationRule<T> {
    return {
        validate: (value): value is T => {
            if (typeof value !== "object" || value === null) {
                return false;
            }

            const obj = value as Record<string, unknown>;
            
            for (const [key, rule] of Object.entries(schema)) {
                if (!rule.validate(obj[key])) {
                    return false;
                }
            }

            return true;
        },
        errorMessage: "Object validation failed"
    };
}

// 使用示例
interface PlayerData {
    name: string;
    level: number;
    experience: number;
}

const playerDataValidator = createObjectValidator<PlayerData>({
    name: isString,
    level: isPositiveNumber,
    experience: isNumber
});

function validatePlayerData(data: unknown): PlayerData {
    if (playerDataValidator.validate(data)) {
        return data; // TypeScript 知道这里 data 的类型是 PlayerData
    }
    throw new Error(playerDataValidator.errorMessage);
}
```

## 性能优化类型模式

### 1. 对象池类型

```typescript
interface Poolable {
    reset(): void;
}

class ObjectPool<T extends Poolable> {
    private available: T[] = [];
    private inUse = new Set<T>();

    constructor(
        private createFn: () => T,
        private resetFn?: (obj: T) => void,
        initialSize: number = 10
    ) {
        for (let i = 0; i < initialSize; i++) {
            this.available.push(this.createFn());
        }
    }

    public acquire(): T {
        let obj = this.available.pop();
        
        if (!obj) {
            obj = this.createFn();
        }

        this.inUse.add(obj);
        return obj;
    }

    public release(obj: T): void {
        if (this.inUse.has(obj)) {
            this.inUse.delete(obj);
            
            if (this.resetFn) {
                this.resetFn(obj);
            } else {
                obj.reset();
            }
            
            this.available.push(obj);
        }
    }

    public clear(): void {
        this.available = [];
        this.inUse.clear();
    }
}

// 使用示例
class Bullet implements Poolable {
    public position = new Vector3(0, 0, 0);
    public velocity = new Vector3(0, 0, 0);
    public damage = 0;

    public reset(): void {
        this.position = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.damage = 0;
    }
}

const bulletPool = new ObjectPool<Bullet>(
    () => new Bullet(),
    undefined,
    50 // 预创建 50 个子弹对象
);
```

### 2. 缓存类型

```typescript
interface CacheOptions {
    maxSize?: number;
    ttl?: number; // Time to live in milliseconds
}

class LRUCache<K, V> {
    private cache = new Map<K, { value: V; timestamp: number }>();
    private accessOrder: K[] = [];

    constructor(private options: CacheOptions = {}) {}

    public get(key: K): V | undefined {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return undefined;
        }

        // 检查 TTL
        if (this.options.ttl && 
            Date.now() - entry.timestamp > this.options.ttl) {
            this.delete(key);
            return undefined;
        }

        // 更新访问顺序
        this.moveToEnd(key);
        
        return entry.value;
    }

    public set(key: K, value: V): void {
        const now = Date.now();

        if (this.cache.has(key)) {
            this.cache.set(key, { value, timestamp: now });
            this.moveToEnd(key);
        } else {
            // 检查大小限制
            if (this.options.maxSize && 
                this.cache.size >= this.options.maxSize) {
                const oldestKey = this.accessOrder.shift()!;
                this.cache.delete(oldestKey);
            }

            this.cache.set(key, { value, timestamp: now });
            this.accessOrder.push(key);
        }
    }

    public delete(key: K): boolean {
        const deleted = this.cache.delete(key);
        if (deleted) {
            const index = this.accessOrder.indexOf(key);
            if (index > -1) {
                this.accessOrder.splice(index, 1);
            }
        }
        return deleted;
    }

    private moveToEnd(key: K): void {
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
            this.accessOrder.splice(index, 1);
            this.accessOrder.push(key);
        }
    }
}

// 使用示例
const assetCache = new LRUCache<string, any>({
    maxSize: 100,
    ttl: 5 * 60 * 1000 // 5 分钟
});
```

## 总结

以上类型定义展示了接口继承、类型别名、泛型、类型谓词等多种TypeScript类型系统特性的使用。特别是在游戏开发中常见的模式：

1. **状态机类型** - 确保状态转换的类型安全
2. **事件系统类型** - 提供强类型的事件处理
3. **配置系统类型** - 类型安全的配置访问
4. **组件系统类型** - ECS 架构的类型支持
5. **数据验证类型** - 运行时验证与编译时类型的结合
6. **性能优化类型** - 对象池和缓存的类型化实现

通过良好的类型设计，可以提高代码的安全性、可读性和可维护性，同时在开发期间捕获更多潜在的错误，提升开发效率和代码质量。 
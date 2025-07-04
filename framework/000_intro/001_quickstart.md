# 快速入门

本指南将帮助您在 15 分钟内搭建完整的开发环境，并创建第一个基于本框架的 Roblox 游戏项目。

## 系统要求

### 硬件要求
- **内存**: 8GB RAM 或更高（推荐 16GB）
- **存储**: 至少 5GB 可用空间
- **处理器**: 支持 64 位的现代处理器

### 操作系统支持
- **Windows**: Windows 10/11 (64-bit)
- **macOS**: macOS 10.15 或更高版本
- **Linux**: Ubuntu 18.04+ / 其他现代 Linux 发行版

## 环境准备

### 必需软件安装

#### 1. Node.js 环境
```bash
# 推荐版本：Node.js 18.x 或 20.x LTS
# 下载地址: https://nodejs.org/
node --version  # 应显示 v18.x.x 或更高版本
```

#### 2. pnpm 包管理器
```bash
# 安装 pnpm (推荐使用 npm 安装)
npm install -g pnpm@latest

# 验证安装
pnpm --version  # 应显示 8.x.x 或更高版本
```

#### 3. Roblox Studio
- 下载并安装最新版本的 [Roblox Studio](https://www.roblox.com/create)
- 确保登录您的 Roblox 账户

#### 4. Git 版本控制
```bash
# 下载地址: https://git-scm.com/
git --version  # 验证安装
```

### 开发工具配置

#### Visual Studio Code (推荐)
1. 下载安装 [VS Code](https://code.visualstudio.com/)
2. 安装推荐扩展：
   ```bash
   # 通过 VS Code 扩展商店安装以下扩展
   - roblox-ts (Roblox TypeScript 支持)
   - ESLint (代码检查)
   - Prettier (代码格式化)
   - TypeScript Importer (自动导入)
   - Error Lens (错误高亮显示)
   ```

#### Rojo 插件配置
1. 在 Roblox Studio 中安装 Rojo 插件
2. 从 [Rojo 官方页面](https://rojo.space/) 下载最新版本
3. 将插件文件放入 Roblox Studio 插件目录

## 项目创建

### 方式一：使用框架模板（推荐）

#### 1. 克隆框架模板
```bash
# 克隆框架模板仓库
git clone https://github.com/your-org/roblox-ts-framework-template.git my-game-project
cd my-game-project

# 重新初始化 Git 仓库
rm -rf .git
git init
git add .
git commit -m "Initial commit from framework template"
```

#### 2. 安装项目依赖
```bash
# 安装所有依赖包
pnpm install

# 验证安装是否成功
pnpm run dev:compile --dry-run
```

#### 3. 配置项目信息
编辑 `package.json` 文件，更新项目信息：
```json
{
  "name": "my-game-project",
  "version": "1.0.0",
  "description": "My awesome Roblox game",
  "author": "Your Name <your.email@example.com>"
}
```

### 方式二：手动创建项目

#### 1. 创建项目目录
```bash
mkdir my-game-project
cd my-game-project
npm init -y
```

#### 2. 安装框架依赖
```bash
# 安装核心框架依赖
pnpm add @flamework/core @flamework/components @flamework/networking
pnpm add @rbxts/react @rbxts/react-roblox @rbxts/reflex @rbxts/react-reflex
pnpm add @rbxts/services @rbxts/log @rbxts/lapis

# 安装开发依赖
pnpm add -D roblox-ts typescript
pnpm add -D rbxts-transformer-flamework
pnpm add -D eslint prettier @isentinel/eslint-config
```

#### 3. 创建项目结构
```bash
# 创建基础目录结构
mkdir -p src/{client,server,shared,battle-session}/{controllers,services,components,ui,store,network}
mkdir -p configs docs types

# 创建配置文件
touch tsconfig.json default.project.json
```

## 开发环境启动

### 1. 编译 TypeScript 代码
```bash
# 编译一次
pnpm run dev:compile

# 或者监听文件变化自动编译
pnpm run dev:watch
```

### 2. 启动 Rojo 同步
```bash
# 启动 Rojo 服务器
pnpm run dev:start

# 服务器会在 http://localhost:34872 启动
```

### 3. 连接 Roblox Studio
1. 打开 Roblox Studio
2. 点击 Rojo 插件按钮
3. 连接到 `localhost:34872`
4. 创建新的 Place 或选择现有 Place

### 4. 验证环境
运行以下命令验证环境是否正确配置：
```bash
# 运行类型检查
pnpm run lint

# 运行测试
pnpm run test

# 编译并检查输出
pnpm run dev:compile && ls -la out/
```

## 项目结构详解

框架采用标准化的目录结构，便于团队协作和代码维护：

```
my-game-project/
├── src/                          # 源代码根目录
│   ├── client/                   # 🎮 客户端代码（同步到 StarterPlayerScripts）
│   │   ├── controllers/          # Flamework 控制器（单例）
│   │   ├── ui/                   # React UI 组件和界面
│   │   ├── store/                # 客户端状态管理
│   │   ├── network/              # 网络通信客户端
│   │   └── runtime.client.ts     # 客户端运行时入口
│   ├── server/                   # 🖥️ 服务端代码（同步到 ServerScriptService）
│   │   ├── services/             # 业务逻辑服务
│   │   ├── background-services/  # 后台长期运行服务
│   │   ├── gateways/             # 外部服务网关
│   │   ├── store/                # 服务端状态管理
│   │   ├── network/              # 网络 API 路由
│   │   └── runtime.server.ts     # 服务端运行时入口
│   ├── shared/                   # 🔗 共享代码（同步到 ReplicatedStorage）
│   │   ├── remotes/              # 网络通信协议定义
│   │   ├── store/                # 共享状态和类型定义
│   │   ├── constants/            # 共享常量
│   │   ├── functions/            # 工具函数库
│   │   └── modules/              # 共享模块
│   ├── battle-session/           # ⚔️ 战斗会话边界（独立运行时）
│   │   ├── client/               # 战斗客户端逻辑
│   │   ├── server/               # 战斗服务端逻辑
│   │   └── shared/               # 战斗共享逻辑
│   └── types/                    # 📋 类型定义（不同步）
├── configs/                      # 🎲 游戏配置数据
│   ├── luban.conf               # Luban 配置文件
│   └── jsonConfigs/             # 生成的 JSON 配置
├── docs/                         # 📚 项目文档
├── out/                          # 🔨 TypeScript 编译输出
├── dist/                         # 📦 生产环境构建输出
├── default.project.json          # Rojo 项目配置
├── tsconfig.json                 # TypeScript 编译配置
└── package.json                  # 项目依赖和脚本
```

### ⭐ 核心目录说明

- **src/client**: 客户端代码，负责 UI、用户交互和本地状态
- **src/server**: 服务端代码，处理业务逻辑、数据持久化和安全验证
- **src/shared**: 两端共享的代码，包括类型定义和工具函数
- **src/battle-session**: 独立的战斗系统，采用 ECS 架构处理实时战斗

## 创建第一个功能

让我们通过创建一个完整的玩家欢迎系统来熟悉框架的开发流程。

### 🔧 步骤1：创建服务端服务

在 `src/server/services/` 目录创建 `player-welcome-service.ts`：

```typescript
import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import type { Logger } from "@rbxts/log";

@Service()
export class PlayerWelcomeService implements OnStart {
    constructor(
        private readonly logger: Logger
    ) {}

    onStart(): void {
        this.logger.Info("PlayerWelcomeService 已启动");
        
        // 监听玩家加入事件
        Players.PlayerAdded.Connect((player) => {
            this.onPlayerJoined(player);
        });

        // 监听玩家离开事件
        Players.PlayerRemoving.Connect((player) => {
            this.onPlayerLeft(player);
        });
    }

    private onPlayerJoined(player: Player): void {
        this.logger.Info(`玩家 ${player.Name} 加入了游戏`);
        
        // 发送欢迎消息到所有玩家
        const welcomeMessage = `🎉 欢迎 ${player.Name} 加入游戏！`;
        
        // 这里可以调用网络服务向客户端发送消息
        // await this.networkService.broadcastMessage(welcomeMessage);
        
        print(welcomeMessage);
    }

    private onPlayerLeft(player: Player): void {
        this.logger.Info(`玩家 ${player.Name} 离开了游戏`);
        
        const goodbyeMessage = `👋 ${player.Name} 离开了游戏`;
        print(goodbyeMessage);
    }
}
```

### 🎮 步骤2：创建客户端控制器

在 `src/client/controllers/` 目录创建 `player-ui-controller.ts`：

```typescript
import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import type { Logger } from "@rbxts/log";

@Controller()
export class PlayerUIController implements OnStart {
    private readonly localPlayer = Players.LocalPlayer;

    constructor(
        private readonly logger: Logger
    ) {}

    onStart(): void {
        this.logger.Info("PlayerUIController 已初始化");
        
        // 等待角色生成
        if (this.localPlayer.Character) {
            this.onCharacterSpawned(this.localPlayer.Character);
        }

        this.localPlayer.CharacterAdded.Connect((character) => {
            this.onCharacterSpawned(character);
        });
    }

    private onCharacterSpawned(character: Model): void {
        this.logger.Info(`角色 ${character.Name} 已生成`);
        
        // 显示欢迎界面
        this.showWelcomeUI();
    }

    private showWelcomeUI(): void {
        print(`🎮 欢迎 ${this.localPlayer.Name}，客户端已准备就绪！`);
        
        // 这里可以显示实际的 UI 组件
        // const welcomeUI = this.uiService.createWelcomeScreen();
        // welcomeUI.show();
    }
}
```

### 🎨 步骤3：创建 React UI 组件

在 `src/client/ui/components/` 目录创建 `welcome-banner.tsx`：

```tsx
import React, { useState, useEffect } from "@rbxts/react";

interface WelcomeBannerProps {
    playerName: string;
    onClose?: () => void;
}

export function WelcomeBanner({ playerName, onClose }: WelcomeBannerProps) {
    const [visible, setVisible] = useState(true);

    // 5秒后自动隐藏
    useEffect(() => {
        const timer = task.wait(5);
        task.spawn(() => {
            task.wait(timer);
            setVisible(false);
            onClose?.();
        });
    }, [onClose]);

    if (!visible) return undefined;

    return (
        <screengui ResetOnSpawn={false}>
            <frame
                Key="WelcomeBanner"
                Size={new UDim2(1, 0, 0.15, 0)}
                Position={new UDim2(0, 0, 0.05, 0)}
                BackgroundColor3={Color3.fromRGB(50, 50, 50)}
                BackgroundTransparency={0.2}
                BorderSizePixel={0}
            >
                {/* 背景渐变效果 */}
                <uigradient
                    Color={new ColorSequence([
                        new ColorSequenceKeypoint(0, Color3.fromRGB(100, 200, 255)),
                        new ColorSequenceKeypoint(1, Color3.fromRGB(50, 150, 255))
                    ])}
                    Rotation={45}
                />

                {/* 圆角 */}
                <uicorner CornerRadius={new UDim(0, 12)} Key="Corner" />

                {/* 欢迎文本 */}
                <textlabel
                    Key="WelcomeText"
                    Text={`🎉 欢迎来到游戏，${playerName}！`}
                    Size={new UDim2(1, -100, 1, 0)}
                    Position={new UDim2(0, 20, 0, 0)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    Font={Enum.Font.GothamBold}
                    TextXAlignment={Enum.TextXAlignment.Left}
                />

                {/* 关闭按钮 */}
                <textbutton
                    Key="CloseButton"
                    Text="×"
                    Size={new UDim2(0, 40, 0, 40)}
                    Position={new UDim2(1, -50, 0.5, -20)}
                    BackgroundColor3={Color3.fromRGB(255, 100, 100)}
                    BackgroundTransparency={0.3}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    Font={Enum.Font.GothamBold}
                    Event={{
                        MouseButton1Click: () => {
                            setVisible(false);
                            onClose?.();
                        }
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} Key="Corner" />
                </textbutton>
            </frame>
        </screengui>
    );
}
```

### 🔗 步骤4：集成状态管理

在 `src/shared/store/` 目录创建 `ui-slice.ts`：

```typescript
import { createProducer } from "@rbxts/reflex";

export interface UIState {
    showWelcome: boolean;
    playerName: string;
    notifications: Array<{
        id: string;
        message: string;
        type: "info" | "success" | "warning" | "error";
        timestamp: number;
    }>;
}

const initialState: UIState = {
    showWelcome: false,
    playerName: "",
    notifications: []
};

export const uiSlice = createProducer(initialState, {
    showWelcomeScreen: (state, playerName: string) => ({
        ...state,
        showWelcome: true,
        playerName: playerName
    }),

    hideWelcomeScreen: (state) => ({
        ...state,
        showWelcome: false
    }),

    addNotification: (state, message: string, type: UIState["notifications"][0]["type"] = "info") => ({
        ...state,
        notifications: [
            ...state.notifications,
            {
                id: tostring(tick()),
                message,
                type,
                timestamp: tick()
            }
        ]
    }),

    removeNotification: (state, id: string) => ({
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== id)
    })
});
```

## 🚀 运行和测试

### 编译和运行
```bash
# 编译 TypeScript 代码
pnpm run dev:compile

# 监听文件变化并自动编译
pnpm run dev:watch

# 启动开发服务器
pnpm run dev:start

# 一键编译并启动
pnpm run dev:compile && pnpm run dev:start
```

### 测试功能
```bash
# 运行所有测试
pnpm run test

# 监听模式运行测试
pnpm run test:watch

# 运行特定测试文件
pnpm run test -- --testNamePattern="PlayerWelcomeService"

# 运行测试并生成覆盖率报告
pnpm run test -- --coverage
```

### 代码质量检查
```bash
# 运行代码检查
pnpm run lint

# 自动修复代码格式
pnpm run lint --fix

# 类型检查
pnpm exec tsc --noEmit
```

## 🛠️ 常用开发工作流

### 📝 开发工作流程
1. **启动开发环境**
   ```bash
   # 终端1：编译监听
   pnpm run dev:watch
   
   # 终端2：启动同步服务
   pnpm run dev:start
   ```

2. **在 Roblox Studio 中连接**
   - 打开 Roblox Studio
   - 点击 Rojo 插件 → Connect
   - 选择 `localhost:34872`

3. **编写代码**
   - 在 VS Code 中编写 TypeScript 代码
   - 保存文件后自动编译并同步到 Studio

4. **测试功能**
   - 在 Studio 中按 F5 运行游戏
   - 查看控制台输出验证功能

### 🔄 配置管理工作流
```bash
# 构建配置文件
pnpm run config:build

# 监听配置文件变化
pnpm run config:watch

# 同时生成代码和数据
pnpm run config:codebuild
```

### 📦 构建部署工作流
```bash
# 生产环境构建
pnpm run prod:build

# 上传资源到 Roblox
pnpm run assets:upload

# 部署到 Roblox 平台
pnpm run deploy:ai
```

## 💡 开发技巧和最佳实践

### 1. 🏗️ 依赖注入模式
```typescript
// ✅ 推荐：使用构造函数注入
@Service()
export class PlayerService {
    constructor(
        private readonly dataService: DataService,
        private readonly logger: Logger,
        private readonly configService: ConfigService
    ) {}

    public async createPlayer(userId: number): Promise<Player> {
        this.logger.Info(`Creating player for user ${userId}`);
        
        const config = this.configService.getPlayerConfig();
        const playerData = await this.dataService.loadPlayerData(userId);
        
        return this.buildPlayer(playerData, config);
    }
}
```

### 2. 🔄 状态管理模式
```typescript
// ✅ 推荐：使用 Reflex 进行状态管理
import { createProducer } from "@rbxts/reflex";

interface GameState {
    players: Map<number, PlayerInfo>;
    gameMode: "menu" | "playing" | "paused";
    score: number;
}

export const gameSlice = createProducer<GameState>({
    players: new Map(),
    gameMode: "menu",
    score: 0
}, {
    // 纯函数，不修改原状态
    addPlayer: (state, player: PlayerInfo) => ({
        ...state,
        players: new Map(state.players).set(player.userId, player)
    }),
    
    setGameMode: (state, mode: GameState["gameMode"]) => ({
        ...state,
        gameMode: mode
    }),
    
    updateScore: (state, points: number) => ({
        ...state,
        score: state.score + points
    })
});
```

### 3. 🌐 网络通信模式
```typescript
// ✅ 推荐：使用类型安全的网络层
// shared/remotes/game-events.ts
export const gameEvents = {
    playerJoined: new ServerToClientEvent<[playerInfo: PlayerInfo]>(),
    playerAction: new ClientToServerEvent<[action: PlayerAction]>(),
    gameStateUpdate: new ServerToClientEvent<[gameState: GameState]>()
};

// server/services/game-service.ts
@Service()
export class GameService {
    constructor() {
        gameEvents.playerAction.Connect((player, action) => {
            this.handlePlayerAction(player, action);
        });
    }

    private handlePlayerAction(player: Player, action: PlayerAction): void {
        // 处理玩家动作
        const newState = this.updateGameState(action);
        
        // 广播状态更新
        gameEvents.gameStateUpdate.FireAll(newState);
    }
}
```

### 4. 🧪 测试驱动开发
```typescript
// ✅ 推荐：编写测试用例
describe("PlayerWelcomeService", () => {
    let service: PlayerWelcomeService;
    let mockLogger: Logger;

    beforeEach(() => {
        mockLogger = {
            Info: jest.fn(),
            Warn: jest.fn(),
            Error: jest.fn()
        } as any;
        
        service = new PlayerWelcomeService(mockLogger);
    });

    it("should log welcome message when player joins", () => {
        const mockPlayer = { Name: "TestPlayer" } as Player;
        
        service.onPlayerJoined(mockPlayer);
        
        expect(mockLogger.Info).toHaveBeenCalledWith(
            "玩家 TestPlayer 加入了游戏"
        );
    });
});
```

## 🐛 调试和故障排除

### 调试工具
```typescript
// ✅ 使用结构化日志
import { Logger } from "@rbxts/log";

@Service()
export class MyService {
    constructor(private readonly logger: Logger) {}

    public doSomething(): void {
        this.logger.Info("开始执行操作", { 
            timestamp: tick(),
            userId: Players.LocalPlayer?.UserId
        });
        
        try {
            // 执行业务逻辑
        } catch (error) {
            this.logger.Error("操作失败", { error: tostring(error) });
        }
    }
}
```

### 常见问题解决

#### 🔧 编译问题
```bash
# 清理编译缓存
pnpm run clean

# 重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 检查 TypeScript 错误
pnpm exec tsc --noEmit
```

#### 🔌 连接问题
```bash
# 检查 Rojo 服务状态
pnpm run dev:start

# 验证端口占用
netstat -an | grep 34872

# 重启 Rojo 服务
pnpm run dev:restart
```

#### 📦 依赖问题
```bash
# 检查包兼容性
pnpm ls --depth=0

# 更新所有依赖
pnpm update

# 检查过时的包
pnpm outdated
```

## 🎯 下一步学习

### 📚 推荐学习路径

#### 🚀 初学者路径
1. **[核心概念](../010_concept/010_concept.md)** - 理解框架的设计理念
2. **[基础编程](../020_base-coding/020_base-coding.md)** - 掌握 Roblox-TS 编程规范
3. **[状态管理](../070_state/070_state.md)** - 学习 Reflex 状态管理

#### 🔍 进阶路径
4. **[网络通信](../050_network/050_network.md)** - 客户端-服务端通信
5. **[配置管理](../060_config/060_config.md)** - 使用 Luban 管理配置
6. **[UI 开发](../100_view/100_view.md)** - React 组件开发

#### 🎓 专家路径
7. **[持续集成](../030_ci-cd/030_ci-cd.md)** - 自动化构建和测试
8. **[数据持久化](../080_data-provider/080_data-provider.md)** - 数据存储策略
9. **[性能优化](../090_performance/090_performance.md)** - 性能监控和优化

### 💪 实践项目建议

1. **简单聊天系统** - 练习网络通信和 UI 开发
2. **玩家数据管理** - 学习状态管理和数据持久化
3. **游戏配置系统** - 掌握 Luban 配置管理
4. **小型多人游戏** - 综合运用所有技术栈

### 🤝 社区和资源

- **官方文档**: 查看框架的完整文档
- **示例项目**: 研究开源的示例项目
- **Discord 社区**: 加入开发者讨论群
- **GitHub Issues**: 报告问题和提出建议

---

🎉 **恭喜您完成了快速入门指南！** 

现在您已经具备了使用本框架开发 Roblox 游戏的基础知识。记住，优秀的代码来自于不断的实践和学习。

祝您开发愉快！🚀

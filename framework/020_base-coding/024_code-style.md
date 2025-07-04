# 代码风格指南

本文档定义了使用本框架进行开发时的命名规范、代码格式和风格标准。遵循统一的代码风格有助于提高代码的可读性、可维护性和团队协作效率。

## 核心原则

1. **一致性优先** - 在项目中保持一致的风格比选择"最佳"风格更重要
2. **可读性至上** - 代码是写给人看的，其次才是给机器执行
3. **明确胜于隐晦** - 使用清晰、描述性的命名，避免晦涩的缩写
4. **简洁但不简陋** - 追求简洁的同时保持代码的完整性和清晰度

## 目录

1. [文件和目录命名](#文件和目录命名)
2. [变量和函数命名](#变量和函数命名)
3. [类型和接口命名](#类型和接口命名)
4. [常量和枚举命名](#常量和枚举命名)
5. [代码格式规范](#代码格式规范)
6. [导入语句规范](#导入语句规范)
7. [注释规范](#注释规范)
8. [框架特定规则](#框架特定规则)
9. [代码组织](#代码组织)
10. [最佳实践](#最佳实践)

---

## 文件和目录命名

### 目录命名
- 使用 `kebab-case`
- 避免缩写，使用完整单词
- 测试文件放在同级目录

```
✅ 正确
battle-session/
player-data/

❌ 错误
__tests__/
battleSession/
plr-data/
tests/
```

### 文件命名

| 文件类型 | 命名规则 | 示例 |
|---------|---------|------|
| React 组件 | `kebab-case.tsx` | `player-info-panel.tsx` |
| 服务类 | `kebab-case-service.ts` | `experience-service.ts` |
| 控制器 | `kebab-case-controller.ts` | `shop-controller.ts` |
| 类型定义 | `kebab-case.ts` | `types.ts`, `selectors.ts` |
| 测试文件 | `*.jack.ts` 或 `*.test.ts` | `experience-service.jack.ts` |
| 工具函数 | `kebab-case.ts` | `game-config.ts` |
| Store相关 | `kebab-case.ts` | `slice.ts`, `selectors.ts` |

---

## 变量和函数命名

### 变量命名
```typescript
// ✅ 正确 - camelCase
const playerName = "John";
const itemCount = 42;
const configData = {};

// ❌ 错误
const PlayerName = "John";
const item_count = 42;
const config_data = {};
```

### 函数命名
```typescript
// ✅ 正确 - camelCase 动词开头
function getPlayerData() {}
function calculateDamage() {}
function grantExperience() {}

// ✅ 布尔函数 - is/has/can 前缀
function isActive() {}
function hasPermission() {}
function canAttack() {}

// ✅ 事件处理函数 - on 前缀
function onPlayerAdded() {}
function onButtonClick() {}

// ✅ React Hook - use 前缀
function usePlayerData() {}
function useMotion() {}
```

### 私有成员
```typescript
class PlayerService {
    // ✅ 正确 - camelCase
    private playerEntities = new Map();
    private addExperienceCalls: Array<any> = [];
    
    // ❌ 错误
    private _playerEntities = new Map();
    private PlayerEntities = new Map();
}
```

---

## 类型和接口命名

### 类和接口
```typescript
// ✅ 正确 - PascalCase
export class ExperienceService {}
export class ConfigLoaderService {}

export interface ButtonProps {}
export interface ItemDefinition {}
export interface PlayerDataService {}

// ❌ 错误
export class experienceService {}
export interface buttonProps {}
```

### 类型别名和泛型
```typescript
// ✅ 正确 - PascalCase
export type PlayerId = string;
export type GamePass = ValueOf<typeof GamePass>;

// ✅ 泛型 - 单字母大写
interface Repository<T extends { id: string }> {}
function process<T, K, V>() {}

// ✅ React Props - PascalCase + Props 后缀
export interface ButtonProps extends FrameProps<TextButton> {}
```

---

## 常量和枚举命名

### 常量命名
```typescript
// ✅ 正确 - UPPER_SNAKE_CASE
const DEFAULT_ICON_PATH = "rbxasset://textures/ui/GuiImagePlaceholder.png";
const MAX_INVENTORY_SIZE = 100;

// ❌ 错误
const defaultIconPath = "...";
const maxInventorySize = 100;
```

### 枚举命名

项目统一使用 PascalCase（大驼峰法）命名枚举成员：

#### 1. Luban 生成的枚举
```typescript
// ✅ Luban 生成的枚举 - PascalCase 成员命名
export enum ItemRarity {
    Common = 1,
    Uncommon = 2,
    Rare = 3,
    Epic = 4,
    Legendary = 5,
    Mythic = 6,
}

export enum ItemType {
    Consumable = 1,
    Equipment = 2,
    Material = 3,
    Quest = 4,
    Misc = 5,
    Key = 6,
    Container = 7,
}
```

#### 2. 项目自定义枚举
```typescript
// ✅ 自定义枚举成员 - PascalCase
export enum GameId {
    Production = 6110424408,
    Development = 7776232708,
}

export enum ItemTag {
    Currency = "currency",
    QuestItem = "questitem",
    Stackable = "stackable",
    Tradeable = "tradeable",
    Upgrade = "upgrade",
}
```

#### 3. 常量对象模式
```typescript
// ✅ 常量对象 - PascalCase 属性名
export const Badge = {
    Welcome: getConfigValueForGame({
        [GameId.Development]: "3630460038655754",
        [GameId.Production]: "1933841780815262",
    }),
} as const;

export const GamePass = {
    Example: getConfigValueForGame({
        [GameId.Development]: "6031475575",
        [GameId.Production]: "6110424408",
    }),
} as const;
```

---

## 代码格式规范

### 缩进和空格
- 使用 **4 个空格** 缩进（不是 2 个）
- 函数参数换行时对齐
- 对象属性垂直对齐

```typescript
// ✅ 正确 - 4 空格缩进
export class ExperienceService {
    constructor(
        private readonly logger: Logger,
        private readonly playerDataService: PlayerDataService
    ) {}

    public grantExperience(
        player: Player,
        source: ExperienceSource
    ): void {
        if (source.baseAmount <= 0) {
            return;
        }
        // ...
    }
}
```

### 字符串和分号
```typescript
// ✅ 正确 - 双引号，尾部分号
const message = "Hello World";
const path = "shared/functions/game-config";

// ❌ 错误
const message = 'Hello World'
const path = 'shared/functions/game-config'
```

### 对象和数组格式
```typescript
// ✅ 正确格式
const config = {
    id: "item_health_potion_small",
    name: "小型生命药水",
    description: "恢复少量生命值",
    type: ItemType.Consumable,
    rarity: ItemRarity.Common,
};

const sources = [
    { type: "kill" as const, baseAmount: 100 },
    { type: "bonus" as const, baseAmount: 200 },
    { type: "quest" as const, baseAmount: 300 },
];
```

---

## 导入语句规范

### 导入顺序
1. 第三方库（@rbxts, @flamework 等）
2. 项目内部导入（绝对路径）
3. 相对路径导入
4. 类型导入（type imports）

```typescript
// ✅ 正确导入顺序
import type { OnInit } from "@flamework/core";
import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";

import { ItemTag } from "shared/store/item/types";

import type { PlayerDataService } from "../../../background-services/player/data/player-data-service";

import {
    EquipmentSlot,
    ItemRarity,
    ItemType,
} from "types/luban/item";
```

### 导入分组
```typescript
// ✅ 正确 - 按字母顺序排列
import {
    EquipmentSlot,
    EquipmentType,
    ItemAttribute,
    ItemEffect,
    ItemRarity,
    ItemType,
} from "types/luban/item";
```

---

## 注释规范

### JSDoc 注释
```typescript
/**
 * 配置管理服务 - 负责加载和处理所有配置数据
 */
@Service()
export class ConfigLoaderService implements OnInit {
    
    /**
     * 映射物品类型
     * @param itemType - 物品类型字符串
     * @returns 映射后的 ItemType 枚举值
     */
    public mapItemType(itemType: string | undefined): ItemType {
        // ...
    }
}
```

### 行内注释
```typescript
export class ConfigLoaderService {
    public onInit(): void {
        this.logger.Info("[ConfigLoaderService] 开始加载配置数据");

        // 加载物品配置
        this.loadItemConfigs();

        // 加载材料配置  
        this.loadMaterialConfigs();

        this.logger.Info("[ConfigLoaderService] 配置数据加载完成");
    }
}
```

### React 组件注释
```typescript
/**
 * Button component.
 *
 * @example
 * ```tsx
 * <Button
 *     CornerRadius={new UDim(0, 8)}
 *     Native={{ Size: new UDim2(0, 100, 0, 100) }}
 *     onClick={useCallback(() => {
 *         print("Hello World!");
 *     }, [])}
 * />
 * ```
 *
 * @param buttonProps - The properties of the Button component.
 * @returns The rendered Button component.
 * @component
 */
export function Button({ ... }: Readonly<ButtonProps>): React.ReactNode {
    // ...
}
```

---

## 框架特定规则

### 配置数据类型优先级

当使用配置系统（如 Luban）生成的类型时：

```typescript
// ✅ 正确 - 直接使用生成的类型
import { ItemRarity, ItemType } from "types/generated/config";

// ❌ 错误 - 不要重新定义已生成的类型
export enum ItemRarity { ... } // 避免
export const ItemTypeMap = { ... }; // 避免

// ✅ 正确使用
const item = {
    rarity: ItemRarity.Common,
    type: ItemType.Equipment,
};
```

### Roblox-ts 特定规则

```typescript
// ✅ 正确 - 使用 roblox-ts 特定方法
const count = array.size();
if (collection.isEmpty()) return;

// ❌ 错误 - 不要使用 JavaScript 方法
const count = array.length;

// ✅ 正确 - 显式检查真值（Lua 差异）
if (value === 0 || value === undefined) return;
if (text === "" || text === undefined) return;

// ❌ 错误 - 隐式真值检查可能导致问题
if (!value) return;  // 0 在 Lua 中是真值！
if (!text) return;   // "" 在 Lua 中是真值！
```

### Flamework 装饰器顺序

```typescript
// ✅ 正确的装饰器顺序
@Service({ loadOrder: 1 })
@LogClass()
export class PlayerService implements OnInit {
    // ...
}

// ✅ 方法装饰器
@Throttle(1000)
@ValidateArgs()
public updatePosition(position: Vector3): void {
    // ...
}
```

---

## 代码组织

### 类成员顺序

```typescript
export class ExampleService {
    // 1. 静态属性
    private static readonly VERSION = "1.0.0";
    
    // 2. 静态方法
    public static getInstance(): ExampleService {
        // ...
    }
    
    // 3. 实例属性
    private readonly config: Config;
    private data: Map<string, any>;
    
    // 4. 构造函数
    constructor(
        private readonly logger: Logger,
        private readonly store: Store
    ) {}
    
    // 5. 生命周期方法
    public onInit(): void {}
    public onStart(): void {}
    
    // 6. 公共方法
    public getData(id: string): any {}
    
    // 7. 受保护方法
    protected processData(data: any): void {}
    
    // 8. 私有方法
    private validateData(data: any): boolean {}
}
```

### 模块组织

```typescript
// 1. 导入语句
import { Service } from "@flamework/core";

// 2. 类型定义
interface DataConfig {
    // ...
}

// 3. 常量定义
const DEFAULT_TIMEOUT = 5000;

// 4. 主要导出
@Service()
export class DataService {
    // ...
}

// 5. 辅助函数
function helper(): void {
    // ...
}
```

---

## 最佳实践

### 1. 命名的描述性

```typescript
// ✅ 好的命名 - 清晰描述功能
function calculatePlayerDamageWithCritical(
    baseDamage: number,
    criticalChance: number,
    criticalMultiplier: number
): number

// ❌ 差的命名 - 过于简短或模糊
function calc(d: number, c: number, m: number): number
```

### 2. 避免魔法数字

```typescript
// ✅ 使用具名常量
const MAX_PLAYER_LEVEL = 100;
const EXPERIENCE_MULTIPLIER = 1.5;
const RESPAWN_DELAY_SECONDS = 10;

if (player.level >= MAX_PLAYER_LEVEL) {
    // ...
}

// ❌ 直接使用魔法数字
if (player.level >= 100) {
    // ...
}
```

### 3. 早返回模式

```typescript
// ✅ 使用早返回减少嵌套
function processPlayer(player: Player | undefined): void {
    if (!player) return;
    if (!player.Character) return;
    if (player.Team === Teams.Spectators) return;
    
    // 主要逻辑
    doSomething(player);
}

// ❌ 过度嵌套
function processPlayer(player: Player | undefined): void {
    if (player) {
        if (player.Character) {
            if (player.Team !== Teams.Spectators) {
                // 主要逻辑
                doSomething(player);
            }
        }
    }
}
```

### 4. 参数对象模式

```typescript
// ✅ 当参数超过 3 个时，使用参数对象
interface CreateItemOptions {
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    level?: number;
    attributes?: ItemAttributes;
}

function createItem(options: CreateItemOptions): Item {
    // ...
}

// ❌ 过多的参数
function createItem(
    name: string,
    type: ItemType,
    rarity: ItemRarity,
    level?: number,
    attributes?: ItemAttributes
): Item {
    // ...
}
```

### 5. 一致的错误处理

```typescript
// ✅ 统一的错误处理模式
export class SafeService {
    public async performOperation(): Promise<Result> {
        try {
            const data = await this.fetchData();
            return this.processData(data);
        } catch (error) {
            this.logger.Error("Operation failed", { error });
            return this.getDefaultResult();
        }
    }
}
```

### 6. 明确的类型定义

```typescript
// ✅ 明确的返回类型
function getPlayerStats(player: Player): PlayerStats {
    return {
        level: player.GetAttribute("Level") as number,
        experience: player.GetAttribute("Experience") as number,
    };
}

// ❌ 隐式的 any 类型
function getPlayerStats(player) {
    return {
        level: player.GetAttribute("Level"),
        experience: player.GetAttribute("Experience"),
    };
}
```

---

## 代码审查清单

在提交代码前，请确保：

- [ ] 遵循项目的命名规范
- [ ] 代码通过 lint 检查（`pnpm run lint`）
- [ ] 代码通过类型检查（`pnpm run dev:compile`）
- [ ] 添加了必要的注释和文档
- [ ] 没有遗留的调试代码（console.log、print 等）
- [ ] 处理了所有的错误情况
- [ ] 测试覆盖了主要功能
- [ ] 代码符合 DRY（Don't Repeat Yourself）原则
- [ ] 遵循了单一职责原则

## 自动化工具

### ESLint 配置

项目使用 ESLint 进行代码质量检查。主要规则包括：

```javascript
// eslint.config.js 示例配置
export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: "./tsconfig.json"
            }
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "import": importPlugin,
            "unused-imports": unusedImports
        },
        rules: {
            // 命名规范
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE"]
                },
                {
                    selector: "function",
                    format: ["camelCase"]
                },
                {
                    selector: "class",
                    format: ["PascalCase"]
                },
                {
                    selector: "interface",
                    format: ["PascalCase"]
                },
                {
                    selector: "typeAlias",
                    format: ["PascalCase"]
                },
                {
                    selector: "enum",
                    format: ["PascalCase"]
                },
                {
                    selector: "enumMember",
                    format: ["PascalCase"]
                }
            ],
            
            // 代码质量
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/prefer-readonly": "error",
            
            // 导入规范
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index"
                    ],
                    "newlines-between": "always",
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true
                    }
                }
            ],
            
            // 格式化
            "max-len": ["error", { code: 120 }],
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            
            // 清理未使用的导入
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_"
                }
            ]
        }
    }
];
```

### Prettier 配置

使用 Prettier 进行代码格式化：

```json
// .prettierrc 配置
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": false,
    "quoteProps": "as-needed",
    "trailingComma": "es5",
    "bracketSpacing": true,
    "bracketSameLine": false,
    "arrowParens": "always",
    "printWidth": 120,
    "endOfLine": "lf",
    "overrides": [
        {
            "files": "*.md",
            "options": {
                "tabWidth": 2,
                "printWidth": 80
            }
        },
        {
            "files": "*.json",
            "options": {
                "tabWidth": 2
            }
        }
    ]
}
```

### TypeScript 编译器配置

严格的 TypeScript 配置确保代码质量：

```json
// tsconfig.json 主要配置
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "noImplicitReturns": true,
        "noImplicitThis": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "exactOptionalPropertyTypes": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitOverride": true
    }
}
```

### VS Code 配置

为团队提供统一的编辑器配置：

```json
// .vscode/settings.json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "typescript.preferences.importModuleSpecifier": "relative",
    "typescript.suggest.autoImports": true,
    "typescript.suggest.includeCompletionsForModuleExports": true,
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "files.eol": "\n",
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true
}
```

```json
// .vscode/extensions.json (推荐插件)
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "@typescript-eslint.typescript-eslint",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next"
    ]
}
```

### Git 钩子配置

使用 Husky 和 lint-staged 确保提交质量：

```json
// package.json 配置
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged",
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
    },
    "lint-staged": {
        "*.{ts,tsx}": [
            "eslint --fix",
            "prettier --write",
            "git add"
        ],
        "*.{js,json,md}": [
            "prettier --write",
            "git add"
        ]
    }
}
```

### 提交信息规范

使用 Conventional Commits 规范：

```javascript
// commitlint.config.js
module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat",     // 新功能
                "fix",      // 修复
                "docs",     // 文档
                "style",    // 格式
                "refactor", // 重构
                "perf",     // 性能优化
                "test",     // 测试
                "chore",    // 构建过程或辅助工具变动
                "revert"    // 回滚
            ]
        ],
        "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
        "subject-max-length": [2, "always", 50],
        "body-max-line-length": [2, "always", 72]
    }
};
```

### 脚本自动化

在 package.json 中添加常用脚本：

```json
{
    "scripts": {
        "lint": "eslint src/**/*.{ts,tsx} --max-warnings 0",
        "lint:fix": "eslint src/**/*.{ts,tsx} --fix",
        "format": "prettier --write src/**/*.{ts,tsx,json,md}",
        "format:check": "prettier --check src/**/*.{ts,tsx,json,md}",
        "type-check": "tsc --noEmit",
        "style-check": "npm run lint && npm run format:check && npm run type-check",
        "prepare": "husky install"
    }
}
```

## 开发工作流

### 1. 代码提交流程

```bash
# 1. 开发完成后检查代码质量
npm run style-check

# 2. 修复发现的问题
npm run lint:fix
npm run format

# 3. 提交代码（会自动运行 pre-commit 钩子）
git commit -m "feat: add player inventory system"

# 4. 推送到远程仓库
git push origin feature/inventory-system
```

### 2. 代码审查清单

在创建 Pull Request 时，确保：

- [ ] 代码通过所有 lint 检查
- [ ] 代码格式符合 Prettier 标准
- [ ] TypeScript 编译无错误和警告
- [ ] 所有新增代码有对应的类型定义
- [ ] 提交信息符合 Conventional Commits 规范
- [ ] 添加了必要的测试用例
- [ ] 更新了相关文档

### 3. CI/CD 集成

在 CI 流水线中集成代码质量检查：

```yaml
# .github/workflows/code-quality.yml
name: Code Quality
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run style-check
      - run: npm run test
```

通过遵循这些代码风格指南和使用现代化的开发工具，我们可以确保项目代码的一致性和高质量，使团队协作更加顺畅，同时大大减少因代码风格不一致导致的问题。

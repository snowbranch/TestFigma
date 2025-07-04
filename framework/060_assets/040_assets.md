# 资源管理框架

基于 Asphalt 的游戏资源管理系统，提供类型安全的资源加载、自动化上传和统一的资源访问接口。

## 核心概念

### 资源生命周期

资源管理遵循以下生命周期：

```
本地文件 → Asphalt上传 → Roblox资源ID → TypeScript类型 → 代码引用
```

1. **开发阶段**：将资源文件放置在 `assets/` 目录
2. **构建阶段**：Asphalt 自动上传并生成类型定义
3. **运行时**：通过类型安全的方式访问资源ID

### 资源分类体系

推荐按功能域组织资源：

```
assets/
├── ui/             # 用户界面资源
│   ├── icons/      # 图标资源
│   ├── buttons/    # 按钮素材
│   └── backgrounds/# 背景图片
├── game/           # 游戏内容资源
│   ├── weapons/    # 武器模型和贴图
│   ├── characters/ # 角色相关资源
│   └── effects/    # 特效资源
├── audio/          # 音频资源
│   ├── sfx/        # 音效
│   ├── music/      # 背景音乐
│   └── voice/      # 语音
├── badges/         # 徽章系统
└── marketing/      # 推广资源
```

## 配置系统

### Asphalt 配置文件

`asphalt.toml` 定义资源同步行为：

```toml
# 资源源目录
asset_dir = "assets"

# 生成的代码输出目录
write_dir = "src/shared/"

# 创建者信息
[creator]
type = "user"              # 或 "group"
id = YOUR_USER_ID          # 用户或组织ID

# 代码生成配置
[codegen]
output_name = "assets"     # 生成文件名
typescript = true          # 启用 TypeScript 类型
style = "nested"           # 嵌套结构 ("flat" | "nested")
strip_extension = true     # 移除文件扩展名
```

### 部署配置集成

在 `mantle.yaml` 中引用资源：

```yaml
target:
  experience:
    icon: assets/marketing/game-icon.png
    
    badges:
      achievement-first-win:
        name: 首次胜利
        description: 完成第一场战斗胜利
        icon: assets/badges/first-win.png
        enabled: true
        
    products:
      premium-pass:
        name: 高级通行证
        price: 100
        icon: assets/marketing/premium-pass.png
```

## 自动化工作流

### 资源同步流程

```bash
# 开发阶段：添加新资源到 assets/ 目录

# 同步资源到 Roblox 并生成类型
pnpm run assets:upload

# 自动执行的后处理步骤：
# 1. ESLint 修复生成的类型文件格式
# 2. 更新 assets.d.ts 和 assets.luau
```

### 生成的文件结构

```typescript
// src/shared/assets.d.ts - TypeScript 类型定义
declare const assets: {
  ui: {
    icons: {
      "settings": "rbxassetid://123456789";
      "inventory": "rbxassetid://123456790";
    };
  };
  game: {
    weapons: {
      "rifle-ak47": "rbxassetid://123456791";
    };
  };
};
export = assets;
```

```lua
-- src/shared/assets.luau - Luau 运行时实现
return {
  ui = {
    icons = {
      settings = "rbxassetid://123456789",
      inventory = "rbxassetid://123456790",
    },
  },
  game = {
    weapons = {
      ["rifle-ak47"] = "rbxassetid://123456791",
    },
  },
}
```

## 代码集成模式

### 基础使用

```typescript
import { assets } from "shared/assets";

// 类型安全的资源访问
const weaponAssetId = assets.game.weapons.rifleAk47;
const settingsIcon = assets.ui.icons.settings;

// 在 UI 组件中使用
const WeaponIcon: React.FC<{weaponType: string}> = ({weaponType}) => {
  return <imagebutton Image={assets.game.weapons[weaponType]} />;
};
```

### 动态资源加载

```typescript
// 资源预加载服务
@Service()
export class AssetPreloader {
  
  private loadedAssets = new Set<string>();
  
  // 预加载资源分组
  async preloadUIAssets(): Promise<void> {
    const uiAssets = Object.values(assets.ui.icons);
    await this.preloadAssets(uiAssets);
  }
  
  async preloadGameAssets(): Promise<void> {
    const gameAssets = [
      ...Object.values(assets.game.weapons),
      ...Object.values(assets.game.effects)
    ];
    await this.preloadAssets(gameAssets);
  }
  
  private async preloadAssets(assetIds: string[]): Promise<void> {
    const contentProvider = game.GetService("ContentProvider");
    const instances = assetIds.map(id => new Instance("ImageLabel").Image = id);
    
    return new Promise((resolve, reject) => {
      contentProvider.PreloadAsync(instances, (assetId, status) => {
        if (status === Enum.AssetFetchStatus.Success) {
          this.loadedAssets.add(assetId);
        }
      });
      resolve();
    });
  }
}
```

### 资源验证工具

```typescript
// 开发时资源完整性检查
export namespace AssetValidator {
  
  export function validateAssetStructure(): boolean {
    const requiredPaths = [
      "ui.icons.settings",
      "ui.icons.inventory", 
      "game.weapons",
      "audio.sfx"
    ];
    
    return requiredPaths.every(path => {
      const value = getNestedProperty(assets, path);
      return value !== undefined;
    });
  }
  
  export function listMissingAssets(): string[] {
    // 检查预期的资源是否存在
    const expected = loadExpectedAssetList();
    const actual = flattenAssetStructure(assets);
    
    return expected.filter(asset => !actual.includes(asset));
  }
}
```

## 最佳实践

### 资源组织原则

1. **按功能域分组**：将相关资源放在同一目录下
2. **语义化命名**：使用描述性的文件名和目录名
3. **版本管理**：重要资源变更时保留旧版本引用
4. **尺寸优化**：上传前优化资源文件大小

### 性能考虑

1. **分组预加载**：按场景需求分组预加载资源
2. **延迟加载**：非关键资源采用延迟加载策略
3. **缓存策略**：合理利用 Roblox 的资源缓存机制
4. **资源压缩**：使用适当的压缩格式和质量设置

### 开发工作流

1. **资源审查**：新资源加入前进行格式和质量审查
2. **自动化测试**：在 CI/CD 中集成资源完整性检查
3. **文档同步**：资源变更时同步更新相关文档
4. **回滚准备**：关键资源变更时准备回滚方案

### 安全考虑

1. **访问控制**：确保 Asphalt 配置中的创建者ID正确
2. **资源审核**：避免上传不当内容
3. **版权合规**：确保所有资源符合版权要求
4. **敏感信息**：避免在资源文件名中包含敏感信息

## 故障排除

### 常见问题

1. **上传失败**：检查网络连接和 Roblox API 状态
2. **类型不匹配**：重新运行 `assets:upload` 刷新类型定义
3. **资源404**：确认资源已正确上传且ID有效
4. **权限错误**：验证创建者ID和访问权限设置

### 调试工具

```typescript
// 资源调试辅助工具
export namespace AssetDebugger {
  
  export function logAssetInfo(assetId: string): void {
    print(`Asset ID: ${assetId}`);
    print(`Asset URL: https://www.roblox.com/library/${assetId.split("//")[1]}`);
  }
  
  export function validateAssetExists(assetId: string): Promise<boolean> {
    const contentProvider = game.GetService("ContentProvider");
    const testImage = new Instance("ImageLabel");
    testImage.Image = assetId;
    
    return new Promise((resolve) => {
      contentProvider.PreloadAsync([testImage], (id, status) => {
        resolve(status === Enum.AssetFetchStatus.Success);
      });
    });
  }
}
```

---

*本文档描述了基于 Asphalt 的资源管理框架的核心概念和最佳实践，适用于任何 roblox-ts 项目的资源管理需求。* 
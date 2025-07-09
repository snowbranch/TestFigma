# Storybook Stories

根据框架文档创建的完整Storybook故事集合。

## 文件结构

```
src/client/ui/
├── components/
│   ├── atoms/                  # 原子组件
│   │   ├── Button.tsx          # 按钮组件
│   │   ├── Button.story.tsx    # 按钮故事
│   │   ├── ItemIcon.tsx        # 物品图标组件
│   │   ├── ItemIcon.story.tsx  # 物品图标故事
│   │   ├── Title.tsx           # 标题组件
│   │   └── Title.story.tsx     # 标题故事
│   ├── molecules/              # 分子组件
│   │   ├── ItemList.tsx        # 物品列表组件
│   │   └── ItemList.story.tsx  # 物品列表故事
│   ├── organisms/              # 有机体组件
│   │   ├── ItemExchangePanel.tsx       # 物品交换面板组件
│   │   └── ItemExchangePanel.story.tsx # 物品交换面板故事
│   └── pages/                  # 页面组件
│       ├── ExchangeScreen.tsx          # 交换屏幕组件
│       └── ExchangeScreen.story.tsx    # 交换屏幕故事
├── hooks/
│   ├── use-px.ts              # 像素转换Hook
│   ├── use-mock-request.ts    # 模拟请求Hook
│   └── index.ts               # Hooks导出
├── ui.storybook.ts            # Storybook配置
└── story.storybook.tsx        # Storybook入口
```

## 组件Story概述

### 原子组件 (Atoms)

#### Button.story.tsx
- **Default**: 默认按钮
- **Sizes**: 不同尺寸按钮
- **Colors**: 不同颜色按钮
- **Disabled**: 禁用状态按钮
- **LongText**: 长文本按钮

#### ItemIcon.story.tsx
- **Default**: 默认物品图标
- **Sizes**: 不同尺寸图标
- **BorderColors**: 不同边框颜色
- **BackgroundColors**: 不同背景颜色
- **RarityColors**: 稀有度颜色演示
- **ItemGrid**: 物品网格布局

#### Title.story.tsx
- **Default**: 默认标题
- **FontSizes**: 不同字体大小
- **TextColors**: 不同文本颜色
- **TextAlignments**: 不同对齐方式
- **Sizes**: 不同尺寸标题
- **PageTitles**: 页面标题示例
- **LongText**: 长文本标题

### 分子组件 (Molecules)

#### ItemList.story.tsx
- **Default**: 默认物品列表
- **SingleItem**: 单个物品
- **MultipleItems**: 多个物品
- **DifferentSpacing**: 不同间距
- **EmptyList**: 空列表
- **ManyItems**: 大量物品
- **InventoryDisplay**: 背包展示

### 有机体组件 (Organisms)

#### ItemExchangePanel.story.tsx
- **Default**: 默认交换面板
- **Hidden**: 隐藏状态
- **Interactive**: 交互式面板
- **States**: 不同状态演示
- **GameScene**: 游戏场景中的面板
- **ErrorHandling**: 错误处理演示

### 页面组件 (Pages)

#### ExchangeScreen.story.tsx
- **Default**: 默认交换屏幕
- **InGameUI**: 游戏UI中的屏幕
- **MultipleInstances**: 多个实例
- **Lifecycle**: 生命周期演示
- **ResponsiveDesign**: 响应式设计

## 使用方法

1. **启动Storybook**: 根据项目的Storybook配置启动
2. **浏览组件**: 在左侧导航中选择组件
3. **查看变体**: 每个组件有多个故事变体
4. **交互测试**: 点击按钮和界面元素进行交互

## 特性

- **完整的原子设计**: 从原子到页面的完整组件层次
- **交互式演示**: 所有组件都支持交互测试
- **模拟数据**: 使用useMockRequest提供模拟API数据
- **响应式设计**: 支持不同屏幕尺寸
- **错误处理**: 演示错误状态和边界情况
- **真实场景**: 模拟真实游戏场景中的使用情况

## 技术栈

- **React**: @rbxts/react
- **Storybook**: @rbxts/pretty-react-hooks (hoarcekat)
- **TypeScript**: roblox-ts
- **UI系统**: Roblox GUI

## 开发指南

按照framework/070_view/104_story-book.md中的指南进行开发：

1. **原子性原则**: 每个Story展示组件的一个特定状态
2. **清晰命名**: 使用描述性的Story名称
3. **最少Props**: 只使用必要的props
4. **真实数据**: 使用有意义的模拟数据
5. **交互性**: 支持用户与组件交互
6. **文档化**: 清晰的说明和用法示例

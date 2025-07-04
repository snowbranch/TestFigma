# 组件层级架构

## 概述

在现代前端开发中，组件化是构建可维护、可扩展应用的核心。本文档定义了项目中的组件层级结构，帮助开发者理解如何组织和命名组件。

组件架构遵循 **原子设计理论 (Atomic Design)**，将组件分为不同的层级，从最小的基础元素到完整的页面。

## 组件层级定义

### 1. 原子组件 (Atomic Components)

最小、最基础的 UI 元素，如同乐高积木中的单颗积木。

**特点**：
- 不可再分的基础组件
- 纯粹的 UI 展示，无业务逻辑
- 高度可复用
- 不关联 Store

**命名规范**：使用简单的单个名词
- `Button` - 按钮
- `Input` - 输入框
- `Icon` - 图标
- `Text` - 文本
- `Image` - 图片
- `Avatar` - 头像

**示例**：
```tsx
// Button.tsx
interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ text, onClick, variant = "primary" }) => {
    return (
        <textbutton
            Text={text}
            Event={{ MouseButton1Click: onClick }}
            BackgroundColor3={variant === "primary" ? Color3.fromRGB(0, 120, 215) : Color3.fromRGB(200, 200, 200)}
        />
    );
};
```

### 2. 分子组件 (Molecular Components)

由多个原子组件组合而成的功能单元，如同乐高积木中的一个轮子。

**特点**：
- 由原子组件组成
- 有独立的职责
- 可复用的 UI 单元
- 通常不直接关联 Store

**命名规范**：使用描述性名称，常见后缀：
- `Card` - 卡片类组件
- `Item` - 列表项组件
- `Bar` - 条状组件
- `Panel` - 面板类组件
- `Form` - 表单类组件

**示例**：
```tsx
// WeaponCard.tsx
interface WeaponCardProps {
    weaponData: {
        name: string;
        damage: number;
        imageId: string;
    };
    onSelect: () => void;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({ weaponData, onSelect }) => {
    return (
        <frame Size={new UDim2(0, 200, 0, 250)}>
            <Image imageId={weaponData.imageId} />
            <Text content={weaponData.name} />
            <Text content={`伤害: ${weaponData.damage}`} />
            <Button text="选择" onClick={onSelect} />
        </frame>
    );
};
```

### 3. 组织组件 (Organism Components)

包含业务逻辑的大型界面模块，如同乐高积木中的一辆车。

**特点**：
- 包含复杂的业务逻辑
- 由多个分子和原子组件组成
- 可能关联 Store（根据具体需求）
- 代表页面上的独立功能区域

**命名规范**：使用描述功能的复合名词
- `Header` - 页头
- `Sidebar` - 侧边栏
- `WeaponGrid` - 武器网格
- `InventoryList` - 背包列表
- `ChatWindow` - 聊天窗口

**示例**：
```tsx
// WeaponGrid.tsx
import { useSelector } from "@rbxts/react-reflex";

export const WeaponGrid: React.FC = () => {
    const weapons = useSelector((state) => state.weapon.weaponInstances);
    
    return (
        <scrollingframe>
            <uigridlayout CellSize={new UDim2(0, 200, 0, 250)} />
            {weapons.map((weapon) => (
                <WeaponCard
                    key={weapon.id}
                    weaponData={weapon}
                    onSelect={() => handleWeaponSelect(weapon.id)}
                />
            ))}
        </scrollingframe>
    );
};
```

### 4. 模板组件 (Template Components)

定义页面布局结构，但不包含具体内容的组件。

**特点**：
- 纯粹的布局定义
- 不关心具体数据
- 定义组件的摆放位置
- 高度可复用的布局模式

**命名规范**：使用描述性名称，后缀为 `Layout` 或 `Template`
- `MainLayout` - 主布局
- `TwoColumnLayout` - 两栏布局
- `DashboardLayout` - 仪表盘布局
- `GameTemplate` - 游戏模板

**示例**：
```tsx
// MainLayout.tsx
interface MainLayoutProps {
    header: React.ReactElement;
    sidebar?: React.ReactElement;
    content: React.ReactElement;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ header, sidebar, content }) => {
    return (
        <frame Size={UDim2.fromScale(1, 1)}>
            <frame Size={new UDim2(1, 0, 0, 60)} Position={new UDim2(0, 0, 0, 0)}>
                {header}
            </frame>
            {sidebar && (
                <frame Size={new UDim2(0, 200, 1, -60)} Position={new UDim2(0, 0, 0, 60)}>
                    {sidebar}
                </frame>
            )}
            <frame 
                Size={new UDim2(1, sidebar ? -200 : 0, 1, -60)} 
                Position={new UDim2(0, sidebar ? 200 : 0, 0, 60)}
            >
                {content}
            </frame>
        </frame>
    );
};
```

### 5. 页面组件 (Page Components)

完整的页面实例，是组件树的根节点。

**特点**：
- 组件树的最高层级
- 与路由系统关联
- 负责从 Store 获取数据
- 整合所有子组件展示完整页面

**命名规范**：使用描述性名称，后缀为 `Page` 或 `Screen`
- `HomePage` - 首页
- `ShopPage` - 商店页面
- `BattlePage` - 战斗页面
- `InventoryScreen` - 背包界面

**示例**：
```tsx
// ShopPage.tsx
import { useSelector, useDispatch } from "@rbxts/react-reflex";

export const ShopPage: React.FC = () => {
    const { items, playerCurrency } = useSelector((state) => ({
        items: state.shop.availableItems,
        playerCurrency: state.player.currency
    }));
    
    return (
        <MainLayout
            header={<Header title="商店" />}
            sidebar={<ShopCategories />}
            content={
                <>
                    <CurrencyDisplay amount={playerCurrency} />
                    <ItemGrid items={items} />
                </>
            }
        />
    );
};
```

## Store 关联原则

### 关联规则

| 组件层级 | 是否关联 Store | 理由 |
|---------|--------------|------|
| 页面组件 | ✅ **是** | 作为数据入口，负责获取所有业务数据 |
| 组织组件 | 🟡 **视情况** | 独立功能模块可关联，或通过 props 接收 |
| 分子组件 | ❌ **否** | 保持可复用性，通过 props 接收数据 |
| 原子组件 | ❌ **否** | 纯 UI 元素，最大限度复用 |
| 模板组件 | ❌ **否** | 纯布局定义，不涉及数据 |

### 设计模式

遵循 **容器组件与展示组件分离** 的设计模式：

- **容器组件 (Smart Components)**
  - 知道 Store 的存在
  - 负责获取和管理数据
  - 通常是页面组件和部分组织组件

- **展示组件 (Dumb Components)**
  - 不知道 Store 的存在
  - 只通过 props 接收数据
  - 通常是原子、分子和模板组件

## 最佳实践

### 1. 组件职责单一
每个组件应该只负责一个明确的功能，避免组件过于复杂。

### 2. 数据流向清晰
数据应该从上往下流动：页面 → 组织 → 分子 → 原子。

### 3. 合理使用 Props
- 原子和分子组件通过 props 接收所有数据
- 避免 prop drilling，必要时使用 Context

### 4. 组件命名一致
遵循命名规范，让组件的层级和功能一目了然。

### 5. 逐步构建
从原子组件开始构建，逐步组合成更复杂的组件。

## 示例：武器商店功能

```
WeaponShopPage (页面组件，关联 Store)
├── MainLayout (模板组件)
│   ├── Header (组织组件)
│   │   ├── Logo (原子组件)
│   │   └── Navigation (分子组件)
│   └── WeaponShopContent (组织组件)
│       ├── WeaponFilter (分子组件)
│       │   ├── Select (原子组件)
│       │   └── Button (原子组件)
│       └── WeaponGrid (组织组件，可能关联 Store)
│           └── WeaponCard[] (分子组件)
│               ├── Image (原子组件)
│               ├── Text (原子组件)
│               └── Button (原子组件)
```

通过这种层级结构，我们可以构建出清晰、可维护、可扩展的组件系统。
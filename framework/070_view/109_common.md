# 客户端通用基础设施 (Client Common Infrastructure)

## 概述

`src/client/common` 目录是整个客户端 UI 系统的基础设施层，提供了构建用户界面所需的核心组件、工具和系统。它遵循分层架构设计，为业务模块提供可复用、类型安全、高性能的基础能力。

## 架构定位

```
客户端架构层次
├── modules/        # 业务模块层（使用 common）
├── common/         # 基础设施层（本文档范围）
│   ├── components/ # UI 组件库
│   ├── contexts/   # 全局状态定义
│   ├── hooks/      # 通用 Hooks
│   └── providers/  # 全局 Provider
└── ...
```

## 核心架构

### 分层设计

1. **基础层 (Primitive Layer)**
   - 原语组件：Frame、Text、Button、Image 等
   - 提供对 Roblox UI 元素的 React 封装
   - 支持主题和响应式设计

2. **功能层 (Feature Layer)**
   - 功能组件：ErrorBoundary、DelayRender、BackgroundBlur 等
   - 基于原语组件构建的高级功能
   - 解决特定的 UI 需求

3. **系统层 (System Layer)**
   - Context：主题、响应式尺寸等全局状态
   - Hooks：状态访问、API 调用、调试工具等
   - Providers：全局配置和依赖注入

### 设计原则

1. **组件设计原则**
   - **原子化**: 每个组件只负责一个功能
   - **可组合**: 组件之间可以灵活组合
   - **类型安全**: 完整的 TypeScript 类型定义
   - **默认友好**: 合理的默认值，开箱即用

2. **性能优化原则**
   - **懒加载**: 使用 DelayRender 延迟非关键内容
   - **缓存优化**: 使用 useMemo 和 useCallback
   - **更新控制**: 通过 React.memo 控制重渲染
   - **边界隔离**: ErrorBoundary 防止错误扩散

3. **开发体验原则**
   - **调试友好**: 提供完整的调试 Hooks
   - **错误提示**: 明确的错误信息和使用指导
   - **文档完善**: 类型定义即文档
   - **渐进增强**: 支持从简单到复杂的使用方式

## 核心组件体系

### 基础原语组件

```typescript
// 所有原语组件都遵循以下模式
interface ComponentProps extends FrameProps<NativeElement> {
    // 组件特定属性
    specificProp?: Type;
    // 事件处理器
    onEvent?: () => void;
    // 子元素
    children?: React.ReactNode;
}
```

核心原语组件：
- **Frame**: 基础容器组件
- **Text**: 文本显示组件
- **Button**: 交互按钮组件
- **Image**: 图片显示组件
- **ScrollingFrame**: 可滚动容器
- **TextInput**: 文本输入组件

### Context 系统

提供全局状态和配置管理：

1. **ThemeContext**: 主题配置（颜色、字体、尺寸）
2. **RemContext**: 响应式尺寸计算
3. **ApiContext**: API 客户端访问（通过 hooks 暴露）

### Hooks 系统

#### 核心 Hooks
- `useTheme()`: 访问主题配置
- `useRem()`: 响应式尺寸计算
- `useSelector()`: Redux 状态选择
- `useApi()`: API 客户端访问
- `useStore()`: 直接访问 Store

#### 调试 Hooks
- `useRenderInfo()`: 渲染性能监控
- `useWhyDidYouUpdate()`: 重渲染原因分析
- `useRenderSpy()`: 渲染行为监视

### Provider 系统

```tsx
// 标准的 Provider 层次结构
<RootProvider>
    <ReflexProvider>      {/* 状态管理 */}
        <ThemeProvider>   {/* 主题系统 */}
            <RemProvider> {/* 响应式尺寸 */}
                <App />
            </RemProvider>
        </ThemeProvider>
    </ReflexProvider>
</RootProvider>
```

## 使用指南

### 基本使用模式

```tsx
import { Frame, Text, Button } from 'client/common/components/primitive';
import { useTheme, useRem } from 'client/common/hooks';

export function MyComponent() {
    const theme = useTheme();
    const rem = useRem();
    
    return (

        <Frame 
    Native={{
        Size: new UDim2(0, 180, 0, 240),
        BackgroundColor3: Color3.fromRGB(42, 42, 42),
    }}
>
            <Text 
                Text="Hello World" 
                TextColor3={theme.colors.text.primary}
            />
            <Button 
                Text="Click Me"
                onClick={() => print("Clicked!")}
            />
        </Frame>
    );
}
```

### 扩展模式

基于 common 组件创建业务组件：

```tsx
import { Frame, type FrameProps } from 'client/common/components/primitive';

interface CardProps extends FrameProps {
    title: string;
    variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ title, variant = 'default', ...props }: CardProps) {
    const theme = useTheme();
    
    return (
        <Frame
            {...props}
            BackgroundColor3={theme.colors.surface}
            // 根据 variant 应用不同样式
        >
            {/* 卡片内容 */}
        </Frame>
    );
}
```

## 最佳实践

1. **始终使用 common 组件**：避免直接使用 Roblox 原生 UI 元素
2. **利用主题系统**：使用主题颜色和字体，保持视觉一致性
3. **响应式设计**：使用 rem 单位实现自适应布局
4. **性能优化**：合理使用 DelayRender 和 memo
5. **错误处理**：在关键位置使用 ErrorBoundary
6. **调试支持**：开发时使用调试 Hooks 分析性能问题
7. **结合实际**: 在游戏开发中, 一般而言,物品,武器等图标默认作为公共组件,无需赘述.

## 相关文档

- [视图层架构](./100_view.md) - 了解整体 UI 架构
- [模块系统](./108_modules.md) - 了解如何构建业务模块
- [Hooks 使用指南](./101_hook.md) - 深入了解 Hook 开发
- [Provider 模式](./105_provider.md) - 理解 Provider 架构
- [主题系统](./104_theme.md) - 主题配置和使用

## 常见问题和解决方案

### 组件定位和布局问题

#### primitive 组件默认居中导致布局异常

**问题描述：**
使用 primitive 组件时，发现组件总是居中显示，无法按预期定位。

**原因分析：**
primitive 组件默认设置了居中属性：
```tsx
// Frame 组件默认设置
AnchorPoint={new Vector2(0.5, 0.5)}
Position={new UDim2(0.5, 0, 0.5, 0)}
Size={new UDim2(1, 0, 1, 0)}
```

**解决方案：**
在 Native 属性中明确设置 `AnchorPoint` 和 `Position`：

```tsx
// ❌ 错误：未设置定位，导致默认居中
<Frame 
    Native={{
        Size: new UDim2(0, 180, 0, 240),
        BackgroundColor3: Color3.fromRGB(42, 42, 42),
    }}
>

// ✅ 正确：明确设置定位
<Frame 
    Native={{
        AnchorPoint: new Vector2(0, 0),  // 左上角锚点
        Position: new UDim2(0, 0, 0, 0), // 左上角定位
        Size: new UDim2(0, 180, 0, 240),
        BackgroundColor3: Color3.fromRGB(42, 42, 42),
    }}
>
```

#### 问题2：Text 组件属性设置错误

**问题描述：**
在 Native 属性中设置 Text、TextColor3 等属性时编译报错。

**原因分析：**
Text 组件将某些属性（Text、TextColor3、TextSize、Font）从 Native 中排除：
```tsx
Native?: Partial<Omit<React.InstanceProps<TextLabel>, 
    "Font" | "Text" | "TextColor3" | "TextColor" | "TextSize">>
```

**解决方案：**
将这些属性作为组件的直接 props，而不是放在 Native 中：

```tsx
// ❌ 错误：在 Native 中设置 Text 属性
<Text 
    Native={{
        Text: "商品名称",
        TextColor3: Color3.fromRGB(255, 255, 255),
        TextSize: 14,
    }}
/>

// ✅ 正确：作为直接 props
<Text 
    Text="商品名称"
    TextColor={Color3.fromRGB(255, 255, 255)}
    TextSize={14}
    Native={{
        Position: new UDim2(0.5, 0, 0, 156),
        Size: new UDim2(1, -20, 0, 20),
        AnchorPoint: new Vector2(0.5, 0),
    }}
/>
```

**注意：** Text 组件使用 `TextColor` 而不是 `TextColor3`。

#### 问题3：Button 组件事件处理

**问题描述：**
在 Native 中设置 Event.Activated 时，onClick 回调不生效。

**解决方案：**
使用 Button 组件的 onClick 属性：

```tsx
// ❌ 错误：在 Native.Event 中设置
<Button 
    Native={{
        Event: {
            Activated: handleClick,
        },
    }}
/>

// ✅ 正确：使用 onClick 属性
<Button 
    onClick={handleClick}
    Native={{
        Text: "购买",
        Size: new UDim2(0, 60, 0, 24),
    }}
/>
```


#### 相对定位规范

**容器设置：**
```tsx
// 主容器：明确设置为左上角定位
<Frame 
    Native={{
        AnchorPoint: new Vector2(0, 0),
        Position: new UDim2(0, 0, 0, 0),
        Size: new UDim2(0, 180, 0, 240),
    }}
>
```

**子元素定位模式：**

1. **左上角对齐元素：**
```tsx
<Frame 
    Native={{
        AnchorPoint: new Vector2(0, 0),
        Position: new UDim2(0, 16, 0, 16),
        Size: new UDim2(0, 148, 0, 120),
    }}
>
```

2. **水平居中元素：**
```tsx
<Text 
    Native={{
        AnchorPoint: new Vector2(0.5, 0),
        Position: new UDim2(0.5, 0, 0, 156),
        Size: new UDim2(1, -20, 0, 20),
    }}
/>
```

3. **右对齐元素：**
```tsx
<Button 
    Native={{
        AnchorPoint: new Vector2(1, 0),
        Position: new UDim2(1, -6, 0, 6),
        Size: new UDim2(0, 16, 0, 16),
    }}
/>
```

4. **垂直居中元素：**
```tsx
<Text 
    Native={{
        AnchorPoint: new Vector2(0, 0.5),
        Position: new UDim2(0, 8, 0.5, 0),
        Size: new UDim2(0, 60, 0, 16),
    }}
/>
```

### 类型导入注意事项

#### Luban 类型导入

**问题：** 混用 `import type` 和普通 `import` 导致编译错误。

**解决方案：** 根据使用方式选择正确的导入方式：

```tsx
// ✅ 作为类型使用
import type { ShopItemConfig } from "types/luban/shop";

// ✅ 作为值使用（构造函数、枚举等）
import { ShopItemConfig, ItemRarity } from "types/luban/shop";

// ✅ 混合导入
import type { ShopItemConfig } from "types/luban/shop";
import { ItemRarity } from "types/luban/shop";
```

### 调试技巧

1. **组件定位调试：**
```tsx
// 临时添加背景色和边框来观察元素位置
Native={{
    BackgroundColor3: Color3.fromRGB(255, 0, 0), // 红色背景
    BorderSizePixel: 2,
    BorderColor3: Color3.fromRGB(0, 255, 0),     // 绿色边框
}}
```


3. **事件调试：**
```tsx
// 在事件处理器中添加调试输出
const handleClick = useCallback(() => {
    print("Button clicked");
    onClick?.();
}, [onClick]);
```

### 性能优化提醒

1. **避免在渲染中创建新对象：**
```tsx
// ❌ 错误：每次渲染都创建新对象
Native={{
    Size: new UDim2(0, rem(180), 0, rem(240)), // 每次渲染都调用 rem()
}}

// ✅ 正确：使用 useMemo 缓存
const cardSize = useMemo(() => new UDim2(0, px(180), 0, px(240)), [px]);
Native={{ Size: cardSize }}
```

2. **回调函数优化：**
```tsx
// 使用 useCallback 避免不必要的重渲染
const handleClick = useCallback(() => {
    // 处理逻辑
}, [/* 依赖项 */]);
```

# Storybook 开发指南 (Storybook Development Guide)

## 概述

Storybook 是组件开发和测试的重要工具，让开发者能够在隔离环境中构建、测试和文档化 UI 组件。本框架集成了 Storybook 支持，并提供了完整的开发工作流程。

## Storybook 组件撰写原则

### 1. 原子性与单一性原则

* **原则**: 每个 Story 应该只展示组件的一个特定状态、一个特定用例或一个特定的变体。避免在一个 Story 中混杂多个 props 组合或复杂的交互流程。
* **实践**: 如果一个组件有多种状态（例如：按钮的默认、禁用、加载中），那么应该为每种状态创建一个独立的 Story。如果组件有多种尺寸、颜色或排版方式，同样为每种组合提供单独的 Story。
* **目的**: 确保每个 Story 都易于理解，并能清晰地展示组件在特定条件下的行为和外观。这也有助于进行视觉回归测试。

### 2. 清晰的命名与分类 

* **原则**: Story 的标题和 Story 名称应该直观、有描述性，并且遵循一致的命名约定。
* **实践**:
    * **主标题 (Title)**: 使用 PascalCase 命名约定，清晰地反映组件的用途。例如：`Button`, `UserProfileCard`, `NavigationMenu`。
    * **子标题 (Story Name)**: 使用 CamelCase 或 kebab-case，描述该 Story 所展示的具体场景或状态。例如：`Default`, `Disabled`, `WithIcon`, `SmallSize`。
    * **分组**: 使用斜杠 `/` 进行分组，可以按照组件类型、功能或层级进行组织。例如：`Atoms/Button`, `Molecules/UserProfileCard`, `Layouts/Header`。
* **目的**: 良好的命名和分类让用户能够轻松地在 Storybook 中找到和浏览组件，理解其结构和功能。

### 3. 最少 Props 原则

* **原则**: 每个 Story 应该只使用展示该特定场景所必需的最少 props。
* **实践**: 避免在 Story 中设置与当前场景无关的 props。如果一个 props 默认为某个值且不影响当前 Story 的演示，就不要显式地在 Story 中设置它。
* **目的**: 减少 Story 的视觉噪音和认知负担，使开发者能一眼看出哪些 props 对当前 Story 的呈现至关重要。

### 4. 真实数据与模拟

* **原则**: 使用尽可能真实但可控的数据来演示组件，并根据需要模拟复杂的依赖。
* **实践**:
    * **数据填充**: 如果组件需要数据（例如用户列表、商品信息），使用有意义的假数据来填充，而不是随机字符或空值。
    * **行为模拟**: 对于包含异步操作（如 API 请求）或复杂交互的组件，使用 Storybook 的 Addons (如 `@storybook/addon-interactions` 和 `msw-storybook-addon`) 来模拟数据响应和用户交互，确保 Story 的独立性。
    * **Context/Provider 模拟**: 如果组件依赖于 React Context，确保在 Story 中正确提供所需的 Context 值，或者使用 Storybook 的 Decorators 来包裹组件。
* **目的**: 让 Story 更具代表性，更接近组件在实际应用中的表现，同时确保 Story 能够独立运行，不受外部服务或全局状态的影响。

### 5. 交互性与可玩性

* **原则**: 如果组件是交互式的，Stories 应该允许用户与组件进行交互，并清晰地展示其交互行为。
* **实践**:
    * **Controls Addon**: 利用 `@storybook/addon-controls` 插件，自动为组件的 props 生成可调节的 UI 控制器，允许用户实时修改 props 值，观察组件变化。
    * **Actions Addon**: 使用 `@storybook/addon-actions` 插件来记录组件触发的回调函数（如 `onClick`, `onChange`）事件，方便开发者验证交互是否按预期工作。
    * **Play Function**: 对于复杂的交互流程，使用 Storybook 7+ 的 `play` 函数来编写自动化交互测试脚本，模拟用户行为（点击、输入等），并断言组件状态。
* **目的**: 让 Stories 成为组件的“操场”，方便开发者和设计者探索组件的所有可能状态和交互，而无需启动整个应用。

### 6. 文档化

* **原则**: Story 不仅仅是代码演示，它也应该是组件行为、用法和 props 的清晰文档。
* **实践**:
    * **ArgsTable**: 利用 Storybook 自动生成的 `ArgsTable`，它会根据组件的 PropTypes 或 TypeScript 类型定义自动展示 props 的名称、类型、默认值和描述。
    * **Markdown 文档**: 在 Story 文件中使用 Markdown 编写额外的说明、注意事项、使用示例或设计意图。
    * **`parameters` 属性**: 利用 Story 的 `parameters` 属性来添加额外的元数据或控制 Storybook 的行为。
* **目的**: 让 Storybook 成为组件的“唯一真相来源”，开发者无需翻阅源代码就能理解组件的全部细节。

### 7. 可访问性考量

* **原则**: 编写 Stories 时，应考虑组件的可访问性，并确保其符合 WCAG 指南。
* **实践**:
    * **A11y Addon**: 使用 `@storybook/addon-a11y` 插件来自动检查组件的可访问性问题（如颜色对比度、ARIA 属性缺失等）。
    * **键盘导航**: 在 Stories 中手动测试组件的键盘导航和焦点管理。
    * **语义化**: 确保组件使用了正确的 HTML 语义元素。
* **目的**: 在开发早期发现并解决可访问性问题，确保组件能够被所有用户使用。


## 架构设计

### Storybook 配置
框架的 Storybook 配置位于 `src/client/ui/ui.storybook.ts`：

```typescript
interface Storybook {
    name: string;
    react?: typeof React;
    storyRoots: Array<Instance  < /dev/null |  undefined>;
}

export = identity<Storybook>({
    name: GAME_NAME,
    react: React,
    storyRoots: [script.Parent],
});
```

### 目录结构
```
src/client/ui/
├── **/                
│   ├── shop-screen.ts                # UI 部件
│   ├── shop-screen.story.tsx         # UI 部件对应的story
├── story.storybook.tsx               # Storybook 入口文件
└── ui.storybook.ts                   # Storybook 配置
```

## Story 文件规范

### 基本 Story 结构
```tsx
// stories/my-component.story.tsx
import { hoarcekat } from '@rbxts/pretty-react-hooks';
import React from '@rbxts/react';

import { useMockRequest } from '../hooks/use-mock-request';
import { RootProvider } from '../providers/root-provider';
import { ErrorHandler } from '../components/error-handler/error-handler';
import MyComponent from '../components/my-component';

export = hoarcekat(() => {
    // 使用模拟请求 hook
    useMockRequest();
    
    return (
        <RootProvider>
            <ErrorHandler>
                <MyComponent />
            </ErrorHandler>
        </RootProvider>
    );
});
```

### Screen 级 Story 示例
基于实际的 ShopScreen Story：

```tsx
// stories/shop.story.tsx
import { hoarcekat } from '@rbxts/pretty-react-hooks';
import React from '@rbxts/react';

import { ErrorHandler } from '../components/error-handler/error-handler';
import { useMockRequest } from '../hooks/use-mock-request';
import { RootProvider } from '../providers/root-provider';
import ShopScreen from '../screens/shop/shop-screen';

export = hoarcekat(() => {
    // 启用模拟请求处理
    useMockRequest();
    
    return (
        <RootProvider>
            <ErrorHandler>
                <ShopScreen />
            </ErrorHandler>
        </RootProvider>
    );
});
```

### 组件级 Story 示例
```tsx
// stories/battle-shop.story.tsx
import { hoarcekat } from '@rbxts/pretty-react-hooks';
import React from '@rbxts/react';

import { ErrorHandler } from '../components/error-handler/error-handler';
import { RootProvider } from '../providers/root-provider';
import { BattleShop } from '../screens/battle/components/battle-shop';

export = hoarcekat(() => {
    return (
        <RootProvider>
            <ErrorHandler>
                <BattleShop />
            </ErrorHandler>
        </RootProvider>
    );
});
```

## Mock 数据管理

### useMockRequest Hook
框架提供 `useMockRequest` hook 来处理开发环境中的模拟数据：

```tsx
import { hoarcekat } from "@rbxts/pretty-react-hooks";
import { useMockRequest } from '../hooks/use-mock-request';

export = hoarcekat(() => {
    // 自动设置模拟请求处理器
    useMockRequest();
    
    // 组件现在可以正常使用 useApi，请求会被模拟处理
    return <MyApiDependentComponent />;
});
```

### Mock 实现原理
`useMockRequest` hook 的作用：
1. 拦截所有 API 请求
2. 根据请求端点返回预定义的模拟数据
3. 模拟真实的异步请求延迟
4. 提供错误状态模拟

### 自定义 Mock 数据
```tsx
// hooks/use-mock-request.ts 中定义模拟数据
const mockResponses = {
    'shop/get-items': {
        code: 0,
        data: [
            { id: '1', name: '武器A', price: 100 },
            { id: '2', name: '武器B', price: 200 },
        ]
    },
    'shop/purchase': {
        code: 0,
        data: { success: true, message: '购买成功' }
    },
    'player/get-currency': {
        code: 0,
        data: { coins: 1000, gems: 50 }
    }
};
```

## Provider 集成

### 标准 Provider 包装
所有 Story 都应该使用标准的 Provider 包装：

```tsx
import { hoarcekat } from "@rbxts/pretty-react-hooks";
export = hoarcekat(() => {
    return (
        <RootProvider baseRem={16}>           {/* 响应式尺寸 */}
            <ErrorHandler>                    {/* 错误边界 */}
                <MyComponent />
            </ErrorHandler>
        </RootProvider>
    );
});
```

### RootProvider 功能
`RootProvider` 提供了完整的开发环境：
- **ReflexProvider**: Reflex store 状态管理
- **ThemeProvider**: 主题系统支持
- **RemProvider**: 响应式尺寸计算

### 可选的特殊配置
```tsx
import { hoarcekat } from "@rbxts/pretty-react-hooks";
export = hoarcekat(() => {
    return (
        <RootProvider 
            baseRem={20}              // 自定义基础尺寸 
            remOverride={{ mobile: 14, desktop: 18 }}  // 设备特定尺寸
        >
            <MyResponsiveComponent />
        </RootProvider>
    );
});
```

## 开发工作流程

### 1. 组件优先开发
使用 Storybook 进行组件优先开发：

```tsx
import { hoarcekat } from "@rbxts/pretty-react-hooks";
// 1. 创建基础组件
function MyButton({ text, onClick }: ButtonProps) {
    return <Button text={text} onClick={onClick} />;
}

// 2. 创建 Story
export = hoarcekat(() => {
    const handleClick = () => print('Button clicked\!');
    
    return (
        <RootProvider>
            <MyButton text="点击我" onClick={handleClick} />
        </RootProvider>
    );
});

// 3. 在 Storybook 中测试和调整
// 4. 集成到实际应用中
```

### 2. API 集成测试
测试需要 API 的组件：

```tsx
import { hoarcekat } from "@rbxts/pretty-react-hooks";
export = hoarcekat(() => {
    // 启用 API 模拟
    useMockRequest();
    
    return (
        <RootProvider>
            <ErrorHandler>
                <ShopComponent />
            </ErrorHandler>
        </RootProvider>
    );
});
```

### 3. 状态管理测试
测试状态相关的组件：

```tsx
import { hoarcekat } from "@rbxts/pretty-react-hooks";
export = hoarcekat(() => {
    useMockRequest();
    
    return (
        <RootProvider>
            <ErrorHandler>
                {/* 组件可以访问完整的 Reflex store */}
                <PlayerInfoPanel />
            </ErrorHandler>
        </RootProvider>
    );
});
```

## 最佳实践

### 1. Story 命名规范
- 文件名：`{component-name}.story.tsx`
- 描述性名称，如 `shop-screen.story.tsx`
- 为复杂组件创建多个 Story 变体

### 2. Mock 数据管理
- 在 Story 中始终使用 `useMockRequest()`
- 确保 Mock 数据与真实 API 响应结构一致
- 为不同状态创建不同的 Mock 场景

### 3. Provider 使用
- 始终使用 `RootProvider` 包装组件
- 使用 `ErrorHandler` 捕获开发时的错误
- 根据需要调整 `baseRem` 参数

### 4. 组件隔离
- 每个 Story 应该独立运行
- 避免 Story 之间的状态污染
- 使用 Props 控制组件状态

## 常见 Story 模式

### 1. 基础组件 Story
```tsx
export = hoarcekat(() => {
    return (
        <RootProvider>
            <Frame Size={new UDim2(1, 0, 1, 0)}>
                <Button 
                    text="示例按钮" 
                    onClick={() => print('clicked')}
                />
            </Frame>
        </RootProvider>
    );
});
```

### 2. 列表组件 Story
```tsx
export = hoarcekat(() => {
    const mockItems = [
        { id: '1', name: '物品1', price: 100 },
        { id: '2', name: '物品2', price: 200 },
        { id: '3', name: '物品3', price: 300 },
    ];
    
    return (
        <RootProvider>
            <ItemList 
                items={mockItems}
                onItemClick={item => print(`点击了: ${item.name}`)}
            />
        </RootProvider>
    );
});
```

### 3. 表单组件 Story
```tsx
export = hoarcekat(() => {
    return (
        <RootProvider>
            <LoginForm 
                onSubmit={(username, password) => {
                    print(`登录: ${username}, ${password}`);
                }}
                onCancel={() => print('取消登录')}
            />
        </RootProvider>
    );
});
```

### 4. 状态驱动 Story
```tsx
export = hoarcekat(() => {
    useMockRequest();
    
    return (
        <RootProvider>
            <ErrorHandler>
                {/* 组件会从 Mock store 获取状态 */}
                <PlayerDashboard />
            </ErrorHandler>
        </RootProvider>
    );
});
```

## 调试和测试

### 1. 错误处理测试
```tsx
export = hoarcekat(() => {
    return (
        <RootProvider>
            <ErrorHandler>
                {/* 故意触发错误以测试错误边界 */}
                <ProblematicComponent />
            </ErrorHandler>
        </RootProvider>
    );
});
```

### 2. 加载状态测试
```tsx
export = hoarcekat(() => {
    useMockRequest();
    
    return (
        <RootProvider>
            <LoadingComponent />
        </RootProvider>
    );
});
```

## 性能考虑

### 1. Story 优化
- 避免在 Story 中进行昂贵计算
- 使用 `useMemo` 缓存复杂的 Mock 数据
- 合理设置 Provider 配置

### 2. Mock 数据优化
- 保持 Mock 数据的精简性
- 避免过大的模拟数据集
- 使用真实但简化的数据结构

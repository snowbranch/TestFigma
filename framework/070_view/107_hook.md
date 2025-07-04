# Hooks 使用指南 (Hooks Usage Guide)

## 概述

Hooks 是 React 函数式组件的核心特性，用于管理状态、副作用和组件逻辑。本框架提供了一套完整的自定义 hooks 库，涵盖状态管理、网络请求、主题访问等常见需求。

## 内置 Hooks

### 状态管理 Hooks

#### useSelector
用于访问全局 Reflex store 状态：

```tsx
import { useSelector } from 'client/ui/hooks';

function PlayerComponent() {
    // 访问当前玩家状态
    const playerData = useSelector(state => state.player.data);
    
    return <Text text={playerData.name} />;
}
```

#### useStore
直接访问 store 实例：

```tsx
import { useStore } from 'client/ui/hooks';

function AdminComponent() {
    const store = useStore();
    
    const resetPlayerData = () => {
        // 注意：通常应该通过 service 来操作，而不是直接 dispatch
        // store.dispatch(resetPlayerAction());
    };
    
    return <Button onClick={resetPlayerData} />;
}
```

### 网络请求 Hooks

#### useApi
提供类型安全的 API 客户端访问：

```tsx
import { useApi } from 'client/ui/hooks';

function ShopComponent() {
    const api = useApi();
    const [items, setItems] = useState<ShopItem[]>([]);
    
    useEffect(() => {
        api.sendRequest('shop/get-items', {})
            .then(result => {
                if (result.code === 0) {
                    setItems(result.data as ShopItem[]);
                }
            });
    }, [api]);
    
    return <ShopList items={items} />;
}
```

#### useMockRequest
在开发和测试环境中模拟网络请求：

```tsx
import { useMockRequest } from 'client/ui/hooks';

function TestComponent() {
    // 自动设置模拟请求处理器
    useMockRequest();
    
    // 组件可以正常使用 useApi，请求会被模拟处理
    return <ShopScreen />;
}
```

### UI 相关 Hooks

#### useTheme
访问当前主题配置：

```tsx
import { useTheme } from 'client/ui/hooks';

function StyledComponent() {
    const theme = useTheme();
    
    return (
        <Frame
            BackgroundColor3={theme.colors.primary}
            Size={new UDim2(0, theme.sizes.buttonWidth, 0, theme.sizes.buttonHeight)}
        />
    );
}
```

#### useRem
响应式尺寸计算：

```tsx
import { useRem } from 'client/ui/hooks';

function ResponsiveComponent() {
    const rem = useRem();
    
    return (
        <Frame
            Size={new UDim2(0, rem(20), 0, rem(5))} // 20rem x 5rem
            Position={new UDim2(0, rem(2), 0, rem(1))} // 边距 2rem x 1rem
        />
    );
}
```

#### usePx
像素单位转换：

```tsx
import { usePx } from 'client/ui/hooks';

function PixelPerfectComponent() {
    const px = usePx();
    
    return (
        <Frame
            Size={new UDim2(0, px(200), 0, px(50))} // 200px x 50px
        />
    );
}
```

#### useOrientation
设备方向检测：

```tsx
import { useOrientation } from 'client/ui/hooks';

function AdaptiveLayout() {
    const orientation = useOrientation();
    
    return (
        <Frame
            Size={orientation === 'landscape' 
                ? new UDim2(1, 0, 0, 100) 
                : new UDim2(0, 300, 1, 0)
            }
        />
    );
}
```

#### useMotion
动画和过渡效果：

```tsx
import { useMotion } from 'client/ui/hooks';

function AnimatedComponent() {
    const [isVisible, setIsVisible] = useState(false);
    const motion = useMotion(isVisible);
    
    return (
        <Frame
            BackgroundTransparency={motion.fade}
            Size={motion.scale}
        />
    );
}
```

### 工具类 Hooks

#### useDefined
确保值非空的类型安全检查：

```tsx
import { useDefined } from 'client/ui/hooks';

function SafeComponent({ data }: { data?: PlayerData }) {
    const player = useDefined(data, 'Player data is required');
    
    // player 现在被类型系统确认为非空
    return <Text text={player.name} />;
}
```

#### usePremium
检查玩家高级会员状态：

```tsx
import { usePremium } from 'client/ui/hooks';

function PremiumFeature() {
    const isPremium = usePremium();
    
    if (\!isPremium) {
        return <Text text="高级会员专享功能" />;
    }
    
    return <PremiumShopContent />;
}
```

## 调试 Hooks

框架提供了一套调试工具 hooks，帮助开发者分析组件性能：

### useRenderInfo
监控组件渲染信息：

```tsx
import { useRenderInfo } from 'client/ui/hooks/debugging';

function DebugComponent() {
    const renderInfo = useRenderInfo('MyComponent');
    
    useEffect(() => {
        print(`组件渲染次数: ${renderInfo.renderCount}`);
        print(`上次渲染时间: ${renderInfo.lastRenderTime}`);
    });
    
    return <MyComponent />;
}
```

### useWhyDidYouUpdate
分析组件重渲染原因：

```tsx
import { useWhyDidYouUpdate } from 'client/ui/hooks/debugging';

function OptimizedComponent(props: MyProps) {
    // 在开发环境中打印导致重渲染的 props
    useWhyDidYouUpdate('MyComponent', props);
    
    return <ExpensiveComponent {...props} />;
}
```

### useRenderSpy
监视组件渲染行为：

```tsx
import { useRenderSpy } from 'client/ui/hooks/debugging';

function SpiedComponent() {
    useRenderSpy('ComponentName', {
        logRenders: true,
        logProps: true,
        logState: true
    });
    
    return <MyComponent />;
}
```

## 自定义 Hooks 开发

### 基本模式

创建自定义 hook 的标准模式：

```tsx
// hooks/use-my-feature.ts
import { useState, useEffect } from '@rbxts/react';

export function useMyFeature(param: string) {
    const [state, setState] = useState<MyData  < /dev/null |  undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    
    useEffect(() => {
        setLoading(true);
        
        // 异步操作
        fetchData(param)
            .then(setState)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [param]);
    
    return { state, loading, error };
}
```

### 状态管理集成

与 Reflex store 集成的自定义 hook：

```tsx
import { useSelector } from 'client/ui/hooks';
import { selectPlayerData } from 'shared/store/player';

export function usePlayerLevel() {
    const playerData = useSelector(selectPlayerData);
    
    const levelProgress = useMemo(() => {
        if (\!playerData) return 0;
        return (playerData.experience / playerData.nextLevelExperience) * 100;
    }, [playerData]);
    
    return {
        level: playerData?.level ?? 0,
        progress: levelProgress,
        experience: playerData?.experience ?? 0
    };
}
```

### 网络请求集成

结合 API 客户端的自定义 hook：

```tsx
import { useApi } from 'client/ui/hooks';

export function useShopData(filter: ShopFilter) {
    const api = useApi();
    const [items, setItems] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(false);
    
    const loadItems = useCallback(() => {
        setLoading(true);
        api.sendRequest('shop/get-items', filter)
            .then(result => {
                if (result.code === 0) {
                    setItems(result.data as ShopItem[]);
                }
            })
            .finally(() => setLoading(false));
    }, [api, filter]);
    
    useEffect(() => {
        loadItems();
    }, [loadItems]);
    
    return { items, loading, refresh: loadItems };
}
```

## 最佳实践

### 1. 命名规范
- 所有 hooks 以 `use` 开头
- 使用描述性名称：`usePlayerData` 而不是 `useData`
- 调试 hooks 放在 `debugging/` 子目录

### 2. 依赖管理
- 正确设置 useEffect 的依赖数组
- 使用 useCallback 缓存函数以避免无限重渲染
- 使用 useMemo 缓存昂贵计算

### 3. 类型安全
- 为所有 hook 参数和返回值定义 TypeScript 类型
- 使用泛型支持灵活的类型参数
- 提供默认值和错误处理

### 4. 性能考虑
- 避免在 hooks 中进行昂贵操作
- 合理使用记忆化优化
- 考虑 hooks 的执行顺序和频率

### 5. 错误处理
- 在 hooks 中捕获和处理错误
- 提供清晰的错误状态和消息
- 使用 loading 状态指示异步操作

## 常见模式

### 数据获取模式
```tsx
function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[]) {
    const [data, setData] = useState<T | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    
    useEffect(() => {
        setLoading(true);
        setError(undefined);
        
        fetcher()
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, deps);
    
    return { data, loading, error };
}
```

### 本地存储模式
```tsx
function useLocalState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState<T>(() => {
        // 从本地存储读取初始值
        return getStoredValue(key) ?? defaultValue;
    });
    
    useEffect(() => {
        // 状态变化时保存到本地存储
        saveToStorage(key, state);
    }, [key, state]);
    
    return [state, setState] as const;
}
```

## 相关文档

- [视图层架构](./100_view.md)
- [Screen 组件规范](./102_screen.md)
- [主题系统](./104_theme.md)
- [提供者模式](./105_view-providers.md)


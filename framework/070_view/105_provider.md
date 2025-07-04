# 提供者模式 (Provider Pattern)

## 概述

提供者模式是 React 中用于状态共享和依赖注入的核心设计模式。本框架通过多层 Provider 架构，为组件提供统一的上下文访问和配置管理能力。

## 架构设计

### Provider 层次结构
```
RootProvider (根提供者)
├── ReflexProvider (状态管理)
├── ThemeProvider (主题系统)
└── RemProvider (响应式尺寸)
```

### 目录结构
```
src/client/ui/
├── providers/
│   ├── root-provider.tsx    # 根提供者组合
│   ├── theme-provider.tsx   # 主题提供者
│   └── rem-provider.tsx     # 尺寸提供者
├── contexts/
│   └── theme/               # 主题上下文定义
└── hooks/                   # 相关访问 hooks
```

## RootProvider 根提供者

### 核心实现
```tsx
// providers/root-provider.tsx
import React from '@rbxts/react';
import { ReflexProvider } from '@rbxts/react-reflex';

import { store } from 'client/store';

import type { RemProviderProps } from './rem-provider';
import { RemProvider } from './rem-provider';
import { ThemeProvider } from './theme-provider';

export function RootProvider({
    baseRem,
    remOverride,
    children,
}: RemProviderProps): React.ReactNode {
    return (
        <ReflexProvider key="reflex-provider" producer={store}>
            <ThemeProvider key="theme-provider">
                <RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
                    {children}
                </RemProvider>
            </ThemeProvider>
        </ReflexProvider>
    );
}
```

### 功能职责
1. **状态管理**: 通过 ReflexProvider 提供全局状态访问
2. **主题支持**: 通过 ThemeProvider 提供主题系统
3. **响应式尺寸**: 通过 RemProvider 提供尺寸计算
4. **配置传递**: 支持 baseRem 和 remOverride 配置

### 使用示例
```tsx
// 基础使用
function App() {
    return (
        <RootProvider>
            <MainContent />
        </RootProvider>
    );
}

// 自定义配置
function AppWithConfig() {
    return (
        <RootProvider 
            baseRem={18}
            remOverride={{ mobile: 16, desktop: 20 }}
        >
            <MainContent />
        </RootProvider>
    );
}
```

## ThemeProvider 主题提供者

### 实现原理
```tsx
// providers/theme-provider.tsx
import React, { useEffect, useMemo, useState } from '@rbxts/react';
import { Workspace } from '@rbxts/services';

import type { Theme } from '../contexts/theme';
import { defaultTheme, ThemeContext } from '../contexts/theme';

type ThemeProviderProps = React.PropsWithChildren;

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactNode {
    const [theme, setTheme] = useState<Theme>(getAdjustedTheme);
    
    // 监听屏幕尺寸变化，动态调整主题
    useEffect(() => {
        const screenSizeCheckInterval = 1;
        let lastScreenSize = getScreenSize();
        
        const connection = game.GetService('RunService').Heartbeat.Connect(() => {
            task.wait(screenSizeCheckInterval);
            
            const currentScreenSize = getScreenSize();
            if (
                currentScreenSize.X \!== lastScreenSize.X ||
                currentScreenSize.Y \!== lastScreenSize.Y
            ) {
                lastScreenSize = currentScreenSize;
                setTheme(getAdjustedTheme());
            }
        });
        
        return () => connection.Disconnect();
    }, []);
    
    const contextValue = useMemo(() => ({ theme }), [theme]);
    
    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}
```

### 核心特性
1. **响应式适配**: 根据屏幕尺寸自动调整主题
2. **性能优化**: 使用 useMemo 缓存上下文值
3. **实时监听**: 监控屏幕尺寸变化
4. **类型安全**: 完整的 TypeScript 支持

## RemProvider 尺寸提供者

### 接口定义
```typescript
export interface RemProviderProps extends React.PropsWithChildren {
    baseRem?: number;                              // 基础 rem 值
    remOverride?: Record<string, number>;          // 设备特定重写
}
```

### 实现原理
```tsx
// providers/rem-provider.tsx
import React, { createContext, useContext, useMemo } from '@rbxts/react';
import { Workspace } from '@rbxts/services';

interface RemContextValue {
    baseRem: number;
    currentRem: number;
    rem: (value: number) => number;
}

const RemContext = createContext<RemContextValue>({
    baseRem: 16,
    currentRem: 16,
    rem: (value: number) => value * 16,
});

export function RemProvider({ 
    children, 
    baseRem = 16, 
    remOverride 
}: RemProviderProps): React.ReactNode {
    const contextValue = useMemo(() => {
        // 获取当前屏幕尺寸
        const screenSize = Workspace.CurrentCamera?.ViewportSize ?? new Vector2(1920, 1080);
        
        // 计算当前 rem 值
        let currentRem = baseRem;
        
        if (remOverride) {
            if (screenSize.X < 768 && remOverride.mobile) {
                currentRem = remOverride.mobile;
            } else if (screenSize.X >= 1024 && remOverride.desktop) {
                currentRem = remOverride.desktop;
            }
        }
        
        // rem 计算函数
        const rem = (value: number) => value * currentRem;
        
        return {
            baseRem,
            currentRem,
            rem,
        };
    }, [baseRem, remOverride]);
    
    return (
        <RemContext.Provider value={contextValue}>
            {children}
        </RemContext.Provider>
    );
}

// 导出 useRem hook
export function useRem() {
    const context = useContext(RemContext);
    if (\!context) {
        throw new Error('useRem must be used within RemProvider');
    }
    return context.rem;
}
```

### 使用示例
```tsx
function ResponsiveComponent() {
    const rem = useRem();
    
    return (
        <Frame
            Size={new UDim2(0, rem(20), 0, rem(10))}  // 20rem x 10rem
            Position={new UDim2(0, rem(2), 0, rem(1))} // 边距 2rem x 1rem
        />
    );
}
```

## ReflexProvider 状态提供者

### 集成方式
```tsx
import { ReflexProvider } from '@rbxts/react-reflex';
import { store } from 'client/store';

// 在 RootProvider 中集成
<ReflexProvider producer={store}>
    {children}
</ReflexProvider>
```

### 使用 Store
```tsx
import { useSelector } from 'client/ui/hooks';

function PlayerInfo() {
    // 访问全局状态
    const playerData = useSelector(state => state.player.data);
    const isLoading = useSelector(state => state.ui.loading);
    
    return (
        <Frame>
            <Text text={playerData.name} />
            {isLoading && <LoadingSpinner />}
        </Frame>
    );
}
```

## 自定义 Provider 开发

### 基本模式
```tsx
// 1. 定义上下文类型
interface MyContextValue {
    data: MyData;
    methods: {
        update: (data: MyData) => void;
        reset: () => void;
    };
}

// 2. 创建上下文
const MyContext = createContext<MyContextValue  < /dev/null |  undefined>(undefined);

// 3. 实现 Provider
export function MyProvider({ children }: React.PropsWithChildren) {
    const [data, setData] = useState<MyData>(initialData);
    
    const contextValue = useMemo(() => ({
        data,
        methods: {
            update: setData,
            reset: () => setData(initialData),
        },
    }), [data]);
    
    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
}

// 4. 创建访问 hook
export function useMyContext() {
    const context = useContext(MyContext);
    if (\!context) {
        throw new Error('useMyContext must be used within MyProvider');
    }
    return context;
}
```

### 高级 Provider 模式
```tsx
// 支持配置的 Provider
interface MyProviderProps extends React.PropsWithChildren {
    config: MyConfig;
    onError?: (error: Error) => void;
}

export function MyProvider({ children, config, onError }: MyProviderProps) {
    const [state, setState] = useState(createInitialState(config));
    const [error, setError] = useState<Error | undefined>();
    
    // 错误处理
    useEffect(() => {
        if (error && onError) {
            onError(error);
        }
    }, [error, onError]);
    
    // 副作用管理
    useEffect(() => {
        const subscription = setupSubscription(config, setState, setError);
        return () => subscription.cleanup();
    }, [config]);
    
    const contextValue = useMemo(() => ({
        state,
        config,
        error,
        actions: {
            updateState: setState,
            clearError: () => setError(undefined),
        },
    }), [state, config, error]);
    
    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
}
```

## Provider 组合模式

### 多 Provider 组合
```tsx
// 创建组合 Provider
export function AppProviders({ children }: React.PropsWithChildren) {
    return (
        <ErrorBoundaryProvider>
            <ThemeProvider>
                <AuthProvider>
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundaryProvider>
    );
}
```

### 条件 Provider
```tsx
// 根据条件包装不同的 Provider
export function ConditionalProvider({ 
    children, 
    useFeature 
}: {
    children: React.ReactNode;
    useFeature: boolean;
}) {
    if (useFeature) {
        return (
            <FeatureProvider>
                {children}
            </FeatureProvider>
        );
    }
    
    return <>{children}</>;
}
```

### 懒加载 Provider
```tsx
// 延迟加载重型 Provider
export function LazyProvider({ children }: React.PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        // 异步初始化
        initializeHeavyResources()
            .then(() => setIsReady(true))
            .catch(console.error);
    }, []);
    
    if (\!isReady) {
        return <LoadingScreen />;
    }
    
    return (
        <HeavyProvider>
            {children}
        </HeavyProvider>
    );
}
```

## 性能优化

### 1. Context 值缓存
```tsx
export function OptimizedProvider({ children }: React.PropsWithChildren) {
    const [state, setState] = useState(initialState);
    
    // 缓存上下文值，避免不必要的重渲染
    const contextValue = useMemo(() => ({
        state,
        actions: {
            update: setState,
            // 其他动作也应该用 useCallback 缓存
        },
    }), [state]);
    
    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
}
```

### 2. Provider 分离
```tsx
// 将频繁变化和稳定的状态分离
export function SeparatedProvider({ children }: React.PropsWithChildren) {
    return (
        <StableDataProvider>      {/* 稳定数据 */}
            <DynamicDataProvider>  {/* 动态数据 */}
                {children}
            </DynamicDataProvider>
        </StableDataProvider>
    );
}
```

### 3. 选择性订阅
```tsx
// 使用选择器模式减少不必要的更新
export function useMyData<T>(selector: (state: MyState) => T): T {
    const context = useContext(MyContext);
    return useMemo(() => selector(context.state), [context.state, selector]);
}
```

## 错误处理

### Provider 错误边界
```tsx
export function SafeProvider({ children }: React.PropsWithChildren) {
    const [error, setError] = useState<Error | undefined>();
    
    if (error) {
        return <ErrorFallback error={error} retry={() => setError(undefined)} />;
    }
    
    return (
        <ErrorBoundary onError={setError}>
            <MyProvider>
                {children}
            </MyProvider>
        </ErrorBoundary>
    );
}
```

### Provider 验证
```tsx
export function ValidatedProvider({ 
    children, 
    config 
}: { 
    children: React.ReactNode; 
    config: unknown; 
}) {
    // 配置验证
    const validatedConfig = useMemo(() => {
        try {
            return validateConfig(config);
        } catch (error) {
            console.error('Invalid provider config:', error);
            return getDefaultConfig();
        }
    }, [config]);
    
    return (
        <MyProvider config={validatedConfig}>
            {children}
        </MyProvider>
    );
}
```

## 测试策略

### Provider 测试工具
```tsx
// 测试辅助组件
export function TestProviderWrapper({ 
    children,
    initialState 
}: {
    children: React.ReactNode;
    initialState?: Partial<MyState>;
}) {
    return (
        <MyProvider initialState={initialState}>
            {children}
        </MyProvider>
    );
}

// 在测试中使用
describe('MyComponent', () => {
    it('should handle provider state', () => {
        render(
            <TestProviderWrapper initialState={{ data: mockData }}>
                <MyComponent />
            </TestProviderWrapper>
        );
        
        // 测试逻辑
    });
});
```

### Mock Provider
```tsx
// 创建 Mock Provider 用于测试
export function MockProvider({ 
    children, 
    mockValue 
}: {
    children: React.ReactNode;
    mockValue: MyContextValue;
}) {
    return (
        <MyContext.Provider value={mockValue}>
            {children}
        </MyContext.Provider>
    );
}
```

## 最佳实践

### 1. Provider 设计原则
- **单一职责**: 每个 Provider 只管理一类相关状态
- **最小接口**: 只暴露必要的数据和方法
- **类型安全**: 提供完整的 TypeScript 类型定义
- **错误处理**: 包含适当的错误边界和验证

### 2. 性能考虑
- 使用 useMemo 和 useCallback 缓存计算结果
- 分离频繁变化和稳定的状态
- 避免不必要的 Provider 嵌套
- 考虑使用选择器模式

### 3. 开发体验
- 提供清晰的错误消息
- 支持开发时的调试工具
- 文档化 Provider 的使用方法
- 提供合理的默认值

### 4. 维护性
- 保持 Provider 接口的稳定性
- 使用版本化的配置格式
- 提供迁移指南
- 定期审查和重构

## 常见模式

### 1. 配置 Provider
```tsx
export function ConfigProvider({ children, config }: ConfigProviderProps) {
    const mergedConfig = useMemo(() => ({
        ...defaultConfig,
        ...config,
    }), [config]);
    
    return (
        <ConfigContext.Provider value={mergedConfig}>
            {children}
        </ConfigContext.Provider>
    );
}
```

### 2. 异步 Provider
```tsx
export function AsyncProvider({ children }: React.PropsWithChildren) {
    const [data, setData] = useState<AsyncData | undefined>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchAsyncData()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);
    
    const contextValue = useMemo(() => ({
        data,
        loading,
        refetch: () => {
            setLoading(true);
            return fetchAsyncData().then(setData).finally(() => setLoading(false));
        },
    }), [data, loading]);
    
    return (
        <AsyncContext.Provider value={contextValue}>
            {children}
        </AsyncContext.Provider>
    );
}
```

## 相关文档

- [视图层架构](./100_view.md)
- [Hooks 使用指南](./101_hook.md)
- [Screen 组件规范](./102_screen.md)
- [Storybook 开发指南](./103_story-book.md)
- [主题系统](./104_theme.md)


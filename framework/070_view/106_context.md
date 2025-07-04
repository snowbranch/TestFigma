# Context 上下文管理 (Context Management)

## 概述

React Context 是框架视图层的核心数据共享机制，通过创建跨组件的数据通道，避免 Props 钻取问题。在 roblox-ts 项目中，Context 与 Provider 模式结合，为 UI 组件提供主题、状态、配置和服务的统一访问。

## 核心概念

### Context 的价值
1. **消除 Props 钻取**：深层组件无需通过中间层传递数据
2. **全局状态共享**：主题、用户信息、应用配置等跨组件访问
3. **依赖注入模式**：为组件提供服务和工具的访问入口
4. **性能边界控制**：精确控制组件更新范围

### 使用时机判断
```tsx
// ✅ 适合使用 Context 的场景
- 主题配置（颜色、字体、尺寸）
- 用户认证状态
- 语言本地化设置
- 响应式断点信息
- 全局 UI 状态（加载中、错误提示）

// ❌ 不适合使用 Context 的场景
- 频繁变化的表单数据
- 只在父子组件间传递的数据
- 临时的 UI 交互状态
- 大量数据的频繁更新
```

## Store vs Context 使用规范

### 选择决策指南

#### 使用 Store (Reflex) 的场景

1. **业务数据和游戏状态**
   - 玩家数据（等级、货币、背包、成就）
   - 游戏进度和存档数据
   - 需要持久化到服务端的数据
   - 需要跨客户端/服务端同步的状态

2. **全局应用状态**
   - 用户认证和授权信息
   - 游戏配置数据（从服务端加载）
   - 需要状态历史记录和时间旅行调试
   - 需要中间件处理的状态（日志、监控）

3. **复杂状态管理**
   - 需要复杂选择器和派生状态
   - 状态更新有明确的业务逻辑和规则
   - 多个独立模块需要访问的共享状态
   - 需要事务性更新的状态

#### 使用 Context 的场景

1. **UI 相关的局部共享状态**
   - Screen 内部的共享数据和方法
   - 主题、样式配置
   - 响应式尺寸计算（rem）
   - UI 组件的临时交互状态

2. **功能模块的封装**
   - 特定功能的配置和方法集合
   - 避免 props drilling 的局部状态
   - Panel 组件间的数据共享
   - 不需要持久化的会话级状态

3. **开发工具和服务**
   - API 客户端实例
   - 调试工具配置
   - 本地化和国际化设置
   - 错误边界和异常处理

### 选择决策树

```
需要共享数据？
├─ 是 ─> 需要持久化或同步到服务端？
│        ├─ 是 ─> 使用 Store
│        └─ 否 ─> 是 UI 相关的局部状态？
│                 ├─ 是 ─> 使用 Context
│                 └─ 否 ─> 数据是否属于核心业务逻辑？
│                          ├─ 是 ─> 使用 Store
│                          └─ 否 ─> 使用 Context
└─ 否 ─> 使用组件本地状态 (useState)
```

### 具体示例对比

#### Store 示例
```typescript
// ✅ 使用 Store 的场景

// 玩家数据 - 需要持久化和同步
const playerData = useSelector(state => state.player.data);
const playerCurrency = useSelector(state => state.player.currency);
const playerInventory = useSelector(state => state.player.inventory);

// 游戏配置 - 从服务端加载的全局配置
const gameConfig = useSelector(state => state.config.game);
const itemDefinitions = useSelector(state => state.config.items);

// 成就系统 - 需要跨模块访问和持久化
const achievements = useSelector(state => state.achievements.unlocked);
const achievementProgress = useSelector(state => state.achievements.progress);
```

#### Context 示例
```typescript
// ✅ 使用 Context 的场景

// Screen 内部共享的购物车状态 - 临时UI状态
const { cartItems, addToCart, removeFromCart } = useShopContext();

// 主题配置 - UI相关的全局配置
const { theme, isDarkMode, toggleTheme } = useThemeContext();

// API 客户端 - 服务实例共享
const { sendRequest, isOnline } = useApiContext();

// 表单状态 - 跨多个 Panel 的临时状态
const { formData, updateField, validateForm } = useFormContext();
```

### 混合使用模式

在实际项目中，Store 和 Context 经常配合使用：

```typescript
// Screen 组件：从 Store 获取业务数据，通过 Context 分发
export function ShopScreen() {
    // 从 Store 获取持久化的业务数据
    const playerCurrency = useSelector(state => state.player.currency);
    const shopItems = useSelector(state => state.shop.items);
    const ownedItems = useSelector(state => state.player.inventory);
    
    // 本地 UI 状态
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [filter, setFilter] = useState<ShopFilter>({});
    
    // 通过 Context 提供给子组件
    const contextValue = useMemo(() => ({
        // Store 数据
        playerCurrency,
        shopItems: filterItems(shopItems, filter),
        ownedItems,
        
        // UI 状态和方法
        cartItems,
        addToCart: (item) => setCartItems(prev => [...prev, item]),
        removeFromCart: (id) => setCartItems(prev => prev.filter(i => i.id !== id)),
        
        // 筛选功能
        filter,
        updateFilter: setFilter,
    }), [playerCurrency, shopItems, ownedItems, cartItems, filter]);
    
    return (
        <ShopContext.Provider value={contextValue}>
            <ShopContent />
        </ShopContext.Provider>
    );
}
```

### 性能考虑

1. **Store 性能优化**
   - 使用选择器精确订阅需要的数据
   - 避免在选择器中创建新对象
   - 合理拆分 state 结构，避免大对象更新

2. **Context 性能优化**
   - 拆分频繁变化和稳定的 Context
   - 使用 useMemo 缓存 Context 值
   - 避免在 Context 中放置频繁更新的数据

### 迁移策略

当需要将数据从 Context 迁移到 Store 或相反时：

```typescript
// Context 迁移到 Store
// Before: 使用 Context
const { userData, updateUser } = useUserContext();

// After: 迁移到 Store
const userData = useSelector(state => state.user.data);
const dispatch = useDispatch();
const updateUser = (data) => dispatch(userActions.update(data));

// Store 迁移到 Context
// Before: 使用 Store
const uiState = useSelector(state => state.ui.modal);

// After: 迁移到 Context
const { modalState, setModalState } = useUIContext();
```

### 最佳实践总结

1. **Store 用于业务核心**，Context 用于 UI 辅助
2. **需要持久化的用 Store**，临时的用 Context
3. **跨边界同步用 Store**，组件内共享用 Context
4. **频繁变化的数据**避免放 Context，考虑用 Store 或本地状态
5. **开始时可以用 Context**，需要时再迁移到 Store

## 标准 Context 实现模式

### 类型定义
```typescript
// contexts/feature/types.ts
export interface FeatureData {
    isEnabled: boolean;
    config: FeatureConfig;
    permissions: string[];
}

export interface FeatureMethods {
    enable: () => void;
    disable: () => void;
    updateConfig: (config: Partial<FeatureConfig>) => void;
    checkPermission: (permission: string) => boolean;
}

export interface FeatureContextValue {
    data: FeatureData;
    methods: FeatureMethods;
    loading: boolean;
    error: string | undefined;
}
```

### Context 创建
```typescript
// contexts/feature/context.ts
import { createContext } from '@rbxts/react';
import type { FeatureContextValue } from './types';

export const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

// 设置显示名称用于 React DevTools 调试
FeatureContext.displayName = 'FeatureContext';
```

### Provider 实现
```tsx
// contexts/feature/provider.tsx
import React, { useCallback, useEffect, useMemo, useState } from '@rbxts/react';
import { FeatureContext } from './context';
import type { FeatureContextValue, FeatureData, FeatureConfig } from './types';

interface FeatureProviderProps extends React.PropsWithChildren {
    initialConfig?: Partial<FeatureConfig>;
    onError?: (error: Error) => void;
}

export function FeatureProvider({ 
    children, 
    initialConfig,
    onError 
}: FeatureProviderProps): React.ReactNode {
    // 状态管理
    const [data, setData] = useState<FeatureData>(() => ({
        isEnabled: false,
        config: { ...defaultConfig, ...initialConfig },
        permissions: [],
    }));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    // 异步数据加载
    useEffect(() => {
        setLoading(true);
        loadFeatureData()
            .then(setData)
            .catch(err => {
                const errorMessage = err.message || '加载功能数据失败';
                setError(errorMessage);
                onError?.(err);
            })
            .finally(() => setLoading(false));
    }, [onError]);

    // 方法实现 - 使用 useCallback 优化性能
    const enable = useCallback(() => {
        setData(prev => ({ ...prev, isEnabled: true }));
    }, []);

    const disable = useCallback(() => {
        setData(prev => ({ ...prev, isEnabled: false }));
    }, []);

    const updateConfig = useCallback((newConfig: Partial<FeatureConfig>) => {
        setData(prev => ({
            ...prev,
            config: { ...prev.config, ...newConfig }
        }));
    }, []);

    const checkPermission = useCallback((permission: string): boolean => {
        return data.permissions.includes(permission);
    }, [data.permissions]);

    // 组装 Context 值 - 分离稳定和变化的部分
    const methods = useMemo(() => ({
        enable,
        disable,
        updateConfig,
        checkPermission,
    }), [enable, disable, updateConfig, checkPermission]);

    const contextValue = useMemo<FeatureContextValue>(() => ({
        data,
        methods,
        loading,
        error,
    }), [data, methods, loading, error]);

    return (
        <FeatureContext.Provider value={contextValue}>
            {children}
        </FeatureContext.Provider>
    );
}
```

### 访问 Hook
```typescript
// contexts/feature/hooks.ts
import { useContext } from '@rbxts/react';
import { FeatureContext } from './context';

export function useFeature() {
    const context = useContext(FeatureContext);
    
    if (!context) {
        throw new Error(
            'useFeature must be used within FeatureProvider. ' +
            'Ensure your component is wrapped with <FeatureProvider>.'
        );
    }
    
    return context;
}

// 选择性访问 Hooks - 减少不必要的重渲染
export function useFeatureData() {
    const { data } = useFeature();
    return data;
}

export function useFeatureMethods() {
    const { methods } = useFeature();
    return methods;
}

export function useFeatureState() {
    const { loading, error } = useFeature();
    return { loading, error };
}
```

### 统一导出
```typescript
// contexts/feature/index.ts
export { FeatureProvider } from './provider';
export { useFeature, useFeatureData, useFeatureMethods, useFeatureState } from './hooks';
export type { FeatureContextValue, FeatureData, FeatureMethods } from './types';
```

## 框架内置 Context 系统

### ThemeContext - 主题系统
```typescript
// contexts/theme/index.ts
import { createContext } from '@rbxts/react';

export interface ThemeContextValue {
    theme: Theme;
    isDarkMode: boolean;
    toggleTheme: () => void;
    setCustomTheme: (theme: Partial<Theme>) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
    theme: defaultTheme,
    isDarkMode: false,
    toggleTheme: () => warn('ThemeContext: toggleTheme called without provider'),
    setCustomTheme: () => warn('ThemeContext: setCustomTheme called without provider'),
});

ThemeContext.displayName = 'ThemeContext';
```

### RemContext - 响应式尺寸
```typescript
// contexts/rem/index.ts
export interface RemContextValue {
    baseRem: number;
    currentRem: number;
    screenSize: Vector2;
    breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide';
    rem: (value: number) => number;
    px: (value: number) => number;
    responsive: <T>(values: { mobile: T; tablet?: T; desktop?: T; wide?: T }) => T;
}

export const RemContext = createContext<RemContextValue>({
    baseRem: 16,
    currentRem: 16,
    screenSize: new Vector2(1920, 1080),
    breakpoint: 'desktop',
    rem: (value) => value * 16,
    px: (value) => value,
    responsive: (values) => values.desktop || values.mobile,
});
```

### ApiContext - 网络请求
```typescript
// contexts/api/index.ts
export interface ApiContextValue {
    client: ApiClient;
    isOnline: boolean;
    requestQueue: number;
    sendRequest: <T>(endpoint: string, data?: unknown) => Promise<ApiResponse<T>>;
    clearCache: () => void;
}

export const ApiContext = createContext<ApiContextValue | undefined>(undefined);
```

## 高级 Context 模式

### 1. 多层 Context 架构
```tsx
// 分层的 Context 系统
export function AppContextProviders({ children }: React.PropsWithChildren) {
    return (
        // 第一层：基础服务
        <ErrorBoundaryProvider>
            <ApiProvider>
                <ThemeProvider>
                    {/* 第二层：用户相关 */}
                    <AuthProvider>
                        <UserPreferencesProvider>
                            {/* 第三层：功能特定 */}
                            <FeatureProvider>
                                <NotificationProvider>
                                    {children}
                                </NotificationProvider>
                            </FeatureProvider>
                        </UserPreferencesProvider>
                    </AuthProvider>
                </ThemeProvider>
            </ApiProvider>
        </ErrorBoundaryProvider>
    );
}
```

### 2. 动态 Context 切换
```tsx
// 根据条件提供不同的 Context 实现
export function DynamicContextProvider({ 
    children, 
    mode 
}: { 
    children: React.ReactNode;
    mode: 'development' | 'production' | 'testing';
}) {
    const ContextProvider = useMemo(() => {
        switch (mode) {
            case 'development':
                return DevContextProvider;
            case 'testing':
                return MockContextProvider;
            default:
                return ProdContextProvider;
        }
    }, [mode]);

    return <ContextProvider>{children}</ContextProvider>;
}
```

### 3. Context 工厂模式
```tsx
// 创建可配置的 Context 工厂
export function createFeatureContext<T extends FeatureConfig>(
    featureName: string,
    defaultConfig: T
) {
    interface ContextValue {
        config: T;
        isEnabled: boolean;
        updateConfig: (config: Partial<T>) => void;
        toggle: () => void;
    }

    const Context = createContext<ContextValue | undefined>(undefined);
    Context.displayName = `${featureName}Context`;

    function Provider({ children, initialConfig }: React.PropsWithChildren<{
        initialConfig?: Partial<T>;
    }>) {
        const [config, setConfig] = useState({ ...defaultConfig, ...initialConfig });
        const [isEnabled, setIsEnabled] = useState(false);

        const contextValue = useMemo<ContextValue>(() => ({
            config,
            isEnabled,
            updateConfig: (newConfig) => setConfig(prev => ({ ...prev, ...newConfig })),
            toggle: () => setIsEnabled(prev => !prev),
        }), [config, isEnabled]);

        return <Context.Provider value={contextValue}>{children}</Context.Provider>;
    }

    function useFeatureContext() {
        const context = useContext(Context);
        if (!context) {
            throw new Error(`use${featureName} must be used within ${featureName}Provider`);
        }
        return context;
    }

    return {
        Provider,
        useFeatureContext,
        Context,
    };
}

// 使用工厂创建具体的 Context
const { Provider: ShopProvider, useFeatureContext: useShop } = createFeatureContext(
    'Shop',
    { itemsPerPage: 10, enableFiltering: true }
);
```

### 4. Context 状态同步
```tsx
// 多个 Context 之间的状态同步
export function SyncedContextProvider({ children }: React.PropsWithChildren) {
    const [sharedState, setSharedState] = useState(initialSharedState);

    // 提供状态同步机制
    const syncState = useCallback((updates: Partial<SharedState>) => {
        setSharedState(prev => ({ ...prev, ...updates }));
    }, []);

    return (
        <SharedStateContext.Provider value={{ sharedState, syncState }}>
            <FeatureAProvider>
                <FeatureBProvider>
                    {children}
                </FeatureBProvider>
            </FeatureAProvider>
        </SharedStateContext.Provider>
    );
}

// 在子 Provider 中使用同步状态
function FeatureAProvider({ children }: React.PropsWithChildren) {
    const { sharedState, syncState } = useSharedState();
    
    const updateFeatureA = useCallback((data: FeatureAData) => {
        // 更新本地状态
        setLocalState(data);
        // 同步到共享状态
        syncState({ featureA: data });
    }, [syncState]);

    // ...
}
```

## 性能优化策略

### 1. Context 值拆分
```tsx
// 将频繁变化和稳定的值分离
const UserDataContext = createContext<UserData | undefined>(undefined);
const UserMethodsContext = createContext<UserMethods | undefined>(undefined);

export function UserProvider({ children }: React.PropsWithChildren) {
    const [userData, setUserData] = useState<UserData>(initialData);
    
    // 方法对象永远不变
    const userMethods = useMemo<UserMethods>(() => ({
        updateProfile: (profile) => setUserData(prev => ({ ...prev, profile })),
        updateSettings: (settings) => setUserData(prev => ({ ...prev, settings })),
        logout: () => setUserData(initialData),
    }), []); // 空依赖数组

    return (
        <UserMethodsContext.Provider value={userMethods}>
            <UserDataContext.Provider value={userData}>
                {children}
            </UserDataContext.Provider>
        </UserMethodsContext.Provider>
    );
}

// 精确订阅
export function useUserData() {
    return useContext(UserDataContext);
}

export function useUserMethods() {
    return useContext(UserMethodsContext);
}
```

### 2. 选择器模式
```tsx
// 创建选择器 Hook，只订阅特定数据
export function useUserSelector<T>(
    selector: (userData: UserData) => T,
    deps?: React.DependencyList
): T {
    const userData = useUserData();
    
    return useMemo(() => {
        if (!userData) throw new Error('User data not available');
        return selector(userData);
    }, [userData, selector, ...(deps || [])]);
}

// 使用选择器
function UserNameDisplay() {
    // 只有 name 变化时才重渲染
    const userName = useUserSelector(user => user.profile.name);
    return <Text text={userName} />;
}

function UserLevelDisplay() {
    // 只有 level 变化时才重渲染
    const userLevel = useUserSelector(user => user.gameData.level);
    return <Text text={`Level ${userLevel}`} />;
}
```

### 3. Context 边界优化
```tsx
// 使用 memo 创建更新边界
const OptimizedConsumer = React.memo(({ data }: { data: OptimizedData }) => {
    // 只有 data 发生实际变化时才重渲染
    return <ExpensiveComponent data={data} />;
});

function ContextConsumer() {
    const { expensiveData, otherData } = useMyContext();
    
    // 将稳定的数据传递给优化的组件
    return (
        <div>
            <OptimizedConsumer data={expensiveData} />
            <SimpleComponent data={otherData} />
        </div>
    );
}
```

### 4. 懒加载 Context
```tsx
// 延迟初始化重型 Context
export function LazyContextProvider({ children }: React.PropsWithChildren) {
    const [context, setContext] = useState<HeavyContextValue | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 异步初始化
        import('./heavy-context-data').then(({ initializeContext }) => {
            return initializeContext();
        }).then(contextValue => {
            setContext(contextValue);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LoadingFallback />;
    }

    return (
        <HeavyContext.Provider value={context}>
            {children}
        </HeavyContext.Provider>
    );
}
```

## Context 测试策略

### 1. 测试工具函数
```typescript
// test-utils/context-testing.tsx
import React from '@rbxts/react';
import type { RenderOptions } from '@testing-library/react';

// Context 包装器工厂
export function createContextTestWrapper<T>(
    ContextProvider: React.ComponentType<React.PropsWithChildren<T>>,
    defaultProps?: T
) {
    return function TestWrapper({ 
        children, 
        ...providerProps 
    }: React.PropsWithChildren<T>) {
        const props = { ...defaultProps, ...providerProps } as T;
        return <ContextProvider {...props}>{children}</ContextProvider>;
    };
}

// 多 Context 包装器
export function createMultiContextWrapper(
    providers: Array<React.ComponentType<React.PropsWithChildren>>
) {
    return function MultiWrapper({ children }: React.PropsWithChildren) {
        return providers.reduceRight(
            (acc, Provider) => <Provider>{acc}</Provider>,
            children as React.ReactElement
        );
    };
}

// 渲染帮助函数
export function renderWithContext<T>(
    ui: React.ReactElement,
    ContextProvider: React.ComponentType<React.PropsWithChildren<T>>,
    contextProps?: T,
    renderOptions?: RenderOptions
) {
    const Wrapper = createContextTestWrapper(ContextProvider, contextProps);
    return render(ui, { wrapper: Wrapper, ...renderOptions });
}
```

### 2. Mock Context 实现
```tsx
// mocks/mock-contexts.tsx
export function createMockContext<T>(defaultValue: T) {
    const MockContext = createContext<T>(defaultValue);
    
    interface MockProviderProps extends React.PropsWithChildren {
        value?: Partial<T>;
        override?: T;
    }
    
    function MockProvider({ children, value, override }: MockProviderProps) {
        const contextValue = override || { ...defaultValue, ...value };
        return (
            <MockContext.Provider value={contextValue}>
                {children}
            </MockContext.Provider>
        );
    }
    
    function useMockContext() {
        return useContext(MockContext);
    }
    
    return {
        Context: MockContext,
        Provider: MockProvider,
        useContext: useMockContext,
    };
}

// 使用 Mock Context
const { Provider: MockThemeProvider, useContext: useMockTheme } = createMockContext({
    theme: mockTheme,
    isDarkMode: false,
    toggleTheme: jest.fn(),
});
```

### 3. 集成测试示例
```typescript
// __tests__/feature-context.test.tsx
describe('FeatureContext', () => {
    const renderWithFeatureContext = (
        ui: React.ReactElement,
        props?: Partial<FeatureProviderProps>
    ) => {
        return renderWithContext(ui, FeatureProvider, props);
    };

    it('should provide initial feature data', () => {
        const TestComponent = () => {
            const { data } = useFeature();
            return <div data-testid="feature-status">{data.isEnabled.toString()}</div>;
        };

        renderWithFeatureContext(<TestComponent />);
        
        expect(screen.getByTestId('feature-status')).toHaveTextContent('false');
    });

    it('should update feature state', () => {
        const TestComponent = () => {
            const { data, methods } = useFeature();
            return (
                <div>
                    <div data-testid="status">{data.isEnabled.toString()}</div>
                    <button onClick={methods.enable} data-testid="enable-btn">
                        Enable
                    </button>
                </div>
            );
        };

        renderWithFeatureContext(<TestComponent />);
        
        fireEvent.click(screen.getByTestId('enable-btn'));
        expect(screen.getByTestId('status')).toHaveTextContent('true');
    });

    it('should handle error states', async () => {
        const mockError = new Error('Feature load failed');
        const onError = jest.fn();

        // Mock the async data loading to fail
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        renderWithFeatureContext(<TestComponent />, { onError });
        
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(mockError);
        });
    });
});
```

## 最佳实践指南

### 1. Context 设计原则
```tsx
// ✅ 好的 Context 设计
interface UserContextValue {
    // 数据部分：明确、类型安全
    user: User | null;
    isAuthenticated: boolean;
    
    // 方法部分：职责清晰
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
    
    // 状态部分：用户体验
    loading: boolean;
    error: string | undefined;
}

// ❌ 避免的设计
interface BadContextValue {
    // 过于宽泛的数据类型
    data: any;
    
    // 不明确的方法名
    doSomething: (param: any) => void;
    
    // 混合了不相关的职责
    user: User;
    theme: Theme;
    apiClient: ApiClient;
}
```

### 2. 错误处理策略
```tsx
// Context 错误边界
export function ContextErrorBoundary({ 
    children, 
    fallback 
}: {
    children: React.ReactNode;
    fallback: React.ComponentType<{ error: Error; reset: () => void }>;
}) {
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
        if (error) {
            console.error('Context Error:', error);
        }
    }, [error]);

    if (error) {
        return <fallback error={error} reset={() => setError(undefined)} />;
    }

    return (
        <ErrorBoundary onError={setError}>
            {children}
        </ErrorBoundary>
    );
}

// 在 Provider 中使用
export function SafeFeatureProvider({ children }: React.PropsWithChildren) {
    return (
        <ContextErrorBoundary fallback={FeatureErrorFallback}>
            <FeatureProvider>
                {children}
            </FeatureProvider>
        </ContextErrorBoundary>
    );
}
```

### 3. 调试和开发工具
```tsx
// 开发环境的 Context 调试工具
export function ContextDebugger<T>({ 
    context, 
    name 
}: { 
    context: React.Context<T>; 
    name: string;
}) {
    const value = useContext(context);
    
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            (globalThis as any)[`__${name}Context__`] = value;
            console.log(`[${name}Context] Updated:`, value);
        }
    }, [value, name]);

    return null;
}

// 在开发环境中使用
function DevProvider({ children }: React.PropsWithChildren) {
    return (
        <FeatureProvider>
            {process.env.NODE_ENV === 'development' && (
                <ContextDebugger context={FeatureContext} name="Feature" />
            )}
            {children}
        </FeatureProvider>
    );
}
```

### 4. 类型安全保障
```typescript
// 严格的类型检查
export function createTypedContext<T>(name: string, defaultValue?: T) {
    const context = createContext<T | undefined>(defaultValue);
    context.displayName = name;

    function useTypedContext(): NonNullable<T> {
        const value = useContext(context);
        
        if (value === undefined) {
            throw new Error(
                `use${name} must be used within ${name}Provider. ` +
                `Make sure you wrap your component tree with <${name}Provider>.`
            );
        }
        
        return value as NonNullable<T>;
    }

    return [context, useTypedContext] as const;
}

// 使用类型安全的 Context
const [FeatureContext, useFeatureContext] = createTypedContext<FeatureContextValue>('Feature');
```

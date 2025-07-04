# 主题系统 (Theme System)

## 概述

主题系统是框架的核心设计支撑，提供一致的视觉设计语言和响应式适配能力。通过集中式的主题配置，实现组件样式的统一管理和动态调整。

## 系统架构

### 核心组件
- **ThemeProvider**: 主题提供者，管理主题状态和屏幕适配
- **ThemeContext**: React Context，提供主题数据访问
- **useTheme**: Hook，用于组件中访问主题
- **主题配置**: 颜色、字体、尺寸等设计令牌定义

### 目录结构
```
src/client/ui/
├── contexts/theme/
│   ├── index.ts           # 主题系统导出
│   ├── colors.ts          # 颜色配置
│   ├── fonts.ts           # 字体配置
│   └── sizes.ts           # 尺寸配置
├── providers/
│   └── theme-provider.tsx # 主题提供者实现
└── hooks/
    └── use-theme.ts       # 主题访问 Hook
```

## 主题配置结构

### 完整主题接口
```typescript
interface Theme {
    colors: {
        // 主要颜色
        primary: Color3;
        secondary: Color3;
        background: Color3;
        surface: Color3;
        
        // 语义颜色
        success: Color3;
        warning: Color3;
        error: Color3;
        info: Color3;
        
        // 文本颜色
        text: {
            primary: Color3;
            secondary: Color3;
            disabled: Color3;
            inverse: Color3;
        };
        
        // 边框颜色
        border: {
            default: Color3;
            focus: Color3;
            error: Color3;
        };
    };
    
    fonts: {
        // 字体族
        primary: string;
        secondary: string;
        mono: string;
        
        // 字体大小
        sizes: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
        
        // 字体重量
        weights: {
            light: number;
            normal: number;
            medium: number;
            bold: number;
        };
    };
    
    sizes: {
        // 组件尺寸
        buttonHeight: number;
        buttonWidth: number;
        inputHeight: number;
        
        // 间距系统
        spacing: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
        };
        
        // 圆角
        borderRadius: {
            sm: number;
            md: number;
            lg: number;
            full: number;
        };
        
        // 阴影
        shadows: {
            sm: string;
            md: string;
            lg: string;
        };
    };
}
```

### 颜色系统 (colors.ts)
```typescript
export const colors = {
    // 品牌主色
    primary: Color3.fromRGB(59, 130, 246),      // 蓝色
    secondary: Color3.fromRGB(139, 92, 246),    // 紫色
    
    // 中性色
    background: Color3.fromRGB(15, 23, 42),     // 深蓝灰
    surface: Color3.fromRGB(30, 41, 59),        // 浅蓝灰
    
    // 语义色
    success: Color3.fromRGB(34, 197, 94),       // 绿色
    warning: Color3.fromRGB(251, 191, 36),      // 黄色
    error: Color3.fromRGB(239, 68, 68),         // 红色
    info: Color3.fromRGB(59, 130, 246),         // 信息蓝
    
    // 文本色
    text: {
        primary: Color3.fromRGB(248, 250, 252),   // 主文本
        secondary: Color3.fromRGB(148, 163, 184), // 次要文本
        disabled: Color3.fromRGB(71, 85, 105),    // 禁用文本
        inverse: Color3.fromRGB(15, 23, 42),      // 反色文本
    },
    
    // 边框色
    border: {
        default: Color3.fromRGB(51, 65, 85),
        focus: Color3.fromRGB(59, 130, 246),
        error: Color3.fromRGB(239, 68, 68),
    },
} as const;
```

### 字体系统 (fonts.ts)
```typescript
export const fonts = {
    // 字体族
    primary: 'SourceSansPro',
    secondary: 'Roboto',
    mono: 'RobotoMono',
    
    // 字体大小 (以像素为单位)
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        display: 32,
    },
    
    // 字体重量
    weights: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
    },
    
    // 行高
    lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;
```

### 尺寸系统 (sizes.ts)
```typescript
export const sizes = {
    // 组件标准尺寸
    buttonHeight: 40,
    buttonWidth: 120,
    inputHeight: 36,
    iconSize: 24,
    avatarSize: 48,
    
    // 间距系统 (8px 基准)
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    
    // 圆角
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },
    
    // 边框宽度
    borderWidth: {
        thin: 1,
        normal: 2,
        thick: 4,
    },
    
    // 容器尺寸
    containers: {
        mobile: 375,
        tablet: 768,
        desktop: 1024,
        wide: 1280,
    },
} as const;
```

## ThemeProvider 实现

### 基础实现
```tsx
// providers/theme-provider.tsx
import React, { useEffect, useMemo, useState } from '@rbxts/react';
import { Workspace } from '@rbxts/services';

import type { Theme } from '../contexts/theme';
import { defaultTheme, ThemeContext } from '../contexts/theme';

type ThemeProviderProps = React.PropsWithChildren;

/** 获取当前屏幕尺寸 */
function getScreenSize(): Vector2 {
    return Workspace.CurrentCamera?.ViewportSize ?? new Vector2(1920, 1080);
}

/** 根据屏幕宽度调整主题 */
function getAdjustedTheme(): Theme {
    const screenSize = getScreenSize();
    const adjustedTheme = table.clone(defaultTheme);
    adjustedTheme.sizes = table.clone(defaultTheme.sizes);
    
    // 根据屏幕尺寸调整组件大小
    if (screenSize.X < 768) {
        // 移动设备调整
        adjustedTheme.sizes.buttonHeight = 36;
        adjustedTheme.sizes.spacing.md = 12;
    } else if (screenSize.X > 1440) {
        // 大屏设备调整
        adjustedTheme.sizes.buttonHeight = 44;
        adjustedTheme.sizes.spacing.md = 20;
    }
    
    return adjustedTheme;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactNode {
    const [theme, setTheme] = useState<Theme>(getAdjustedTheme);
    
    // 监听屏幕尺寸变化
    useEffect(() => {
        const screenSizeCheckInterval = 1; // 秒
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

## useTheme Hook

### 基础实现
```typescript
// hooks/use-theme.ts
import { useContext } from '@rbxts/react';

import type { Theme } from '../contexts/theme';
import { ThemeContext } from '../contexts/theme';

export function useTheme(): Theme {
    const { theme } = useContext(ThemeContext);
    return theme;
}
```

### 扩展 Hook 功能
```typescript
// 带有工具函数的增强版 useTheme
export function useTheme() {
    const { theme } = useContext(ThemeContext);
    
    // 工具函数
    const utils = useMemo(() => ({
        // 获取间距值
        getSpacing: (key: keyof typeof theme.sizes.spacing) => theme.sizes.spacing[key],
        
        // 获取颜色值
        getColor: (path: string) => {
            const keys = path.split('.');
            let value: any = theme.colors;
            for (const key of keys) {
                value = value[key];
            }
            return value as Color3;
        },
        
        // 创建阴影样式
        createShadow: (elevation: 'sm'  < /dev/null |  'md' | 'lg') => ({
            ShadowOffset: new Vector2(0, elevation === 'sm' ? 1 : elevation === 'md' ? 2 : 4),
            ShadowColor: Color3.fromRGB(0, 0, 0),
            ShadowTransparency: 0.1,
        }),
        
        // 响应式尺寸
        responsive: (mobile: number, desktop?: number) => {
            const screenWidth = Workspace.CurrentCamera?.ViewportSize.X ?? 1920;
            return screenWidth < 768 ? mobile : (desktop ?? mobile);
        },
    }), [theme]);
    
    return {
        theme,
        ...utils,
    };
}
```

## 组件中使用主题

### 基础样式应用
```tsx
import React from '@rbxts/react';
import { useTheme } from 'client/ui/hooks';

function StyledButton({ text, onClick }: ButtonProps) {
    const theme = useTheme();
    
    return (
        <Button
            Text={text}
            Size={new UDim2(0, theme.sizes.buttonWidth, 0, theme.sizes.buttonHeight)}
            BackgroundColor3={theme.colors.primary}
            TextColor3={theme.colors.text.inverse}
            TextSize={theme.fonts.sizes.md}
            Font={theme.fonts.primary}
            BorderSizePixel={0}
            onClick={onClick}
        />
    );
}
```

### 动态样式计算
```tsx
function AdaptiveCard({ title, content }: CardProps) {
    const { theme, getSpacing, responsive } = useTheme();
    
    const cardPadding = getSpacing('md');
    const cardWidth = responsive(300, 400);
    
    return (
        <Frame
            Size={new UDim2(0, cardWidth, 0, 200)}
            BackgroundColor3={theme.colors.surface}
            BorderColor3={theme.colors.border.default}
            BorderSizePixel={theme.sizes.borderWidth.thin}
        >
            <UIPadding
                PaddingLeft={new UDim(0, cardPadding)}
                PaddingRight={new UDim(0, cardPadding)}
                PaddingTop={new UDim(0, cardPadding)}
                PaddingBottom={new UDim(0, cardPadding)}
            />
            <TextLabel
                Text={title}
                TextColor3={theme.colors.text.primary}
                TextSize={theme.fonts.sizes.lg}
                Font={theme.fonts.primary}
            />
        </Frame>
    );
}
```

### 条件样式
```tsx
function StatusButton({ status, text, onClick }: StatusButtonProps) {
    const theme = useTheme();
    
    const getStatusColor = () => {
        switch (status) {
            case 'success': return theme.colors.success;
            case 'warning': return theme.colors.warning;
            case 'error': return theme.colors.error;
            default: return theme.colors.primary;
        }
    };
    
    return (
        <Button
            Text={text}
            BackgroundColor3={getStatusColor()}
            TextColor3={theme.colors.text.inverse}
            Size={new UDim2(0, theme.sizes.buttonWidth, 0, theme.sizes.buttonHeight)}
            onClick={onClick}
        />
    );
}
```

## 响应式设计

### 屏幕尺寸断点
```typescript
const breakpoints = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
} as const;

function useBreakpoint() {
    const [screenSize, setScreenSize] = useState(getScreenSize());
    
    useEffect(() => {
        // 监听屏幕尺寸变化
        const connection = game.GetService('RunService').Heartbeat.Connect(() => {
            const currentSize = getScreenSize();
            if (currentSize.X \!== screenSize.X || currentSize.Y \!== screenSize.Y) {
                setScreenSize(currentSize);
            }
        });
        
        return () => connection.Disconnect();
    }, []);
    
    const currentBreakpoint = useMemo(() => {
        const width = screenSize.X;
        if (width >= breakpoints.wide) return 'wide';
        if (width >= breakpoints.desktop) return 'desktop';
        if (width >= breakpoints.tablet) return 'tablet';
        return 'mobile';
    }, [screenSize]);
    
    return { currentBreakpoint, screenSize };
}
```

### 响应式组件示例
```tsx
function ResponsiveLayout({ children }: LayoutProps) {
    const { currentBreakpoint } = useBreakpoint();
    const theme = useTheme();
    
    const getLayoutConfig = () => {
        switch (currentBreakpoint) {
            case 'mobile':
                return {
                    columns: 1,
                    padding: theme.sizes.spacing.sm,
                    gap: theme.sizes.spacing.sm,
                };
            case 'tablet':
                return {
                    columns: 2,
                    padding: theme.sizes.spacing.md,
                    gap: theme.sizes.spacing.md,
                };
            default:
                return {
                    columns: 3,
                    padding: theme.sizes.spacing.lg,
                    gap: theme.sizes.spacing.lg,
                };
        }
    };
    
    const config = getLayoutConfig();
    
    return (
        <Frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={theme.colors.background}
        >
            <UIPadding
                PaddingLeft={new UDim(0, config.padding)}
                PaddingRight={new UDim(0, config.padding)}
                PaddingTop={new UDim(0, config.padding)}
                PaddingBottom={new UDim(0, config.padding)}
            />
            <UIGridLayout
                CellSize={new UDim2(1 / config.columns, -config.gap, 0, 100)}
                CellPadding={new UDim2(0, config.gap, 0, config.gap)}
            />
            {children}
        </Frame>
    );
}
```

## 主题定制

### 运行时主题切换
```typescript
// 扩展的主题提供者，支持主题切换
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
    const [theme, setTheme] = useState<Theme>(getAdjustedTheme);
    
    const switchTheme = useCallback((newTheme: 'light' | 'dark') => {
        setCurrentTheme(newTheme);
        setTheme(getAdjustedTheme(newTheme));
    }, []);
    
    const contextValue = useMemo(() => ({
        theme,
        currentTheme,
        switchTheme,
    }), [theme, currentTheme, switchTheme]);
    
    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}
```

### 主题变体
```typescript
const lightTheme: Theme = {
    colors: {
        primary: Color3.fromRGB(59, 130, 246),
        background: Color3.fromRGB(255, 255, 255),
        text: {
            primary: Color3.fromRGB(15, 23, 42),
            secondary: Color3.fromRGB(71, 85, 105),
        },
        // ... 其他颜色
    },
    // ... 其他配置
};

const darkTheme: Theme = {
    colors: {
        primary: Color3.fromRGB(59, 130, 246),
        background: Color3.fromRGB(15, 23, 42),
        text: {
            primary: Color3.fromRGB(248, 250, 252),
            secondary: Color3.fromRGB(148, 163, 184),
        },
        // ... 其他颜色
    },
    // ... 其他配置
};
```

## 最佳实践

### 1. 设计令牌使用
- 始终使用主题中定义的颜色和尺寸
- 避免硬编码样式值
- 使用语义化的颜色名称

### 2. 响应式设计
- 考虑不同屏幕尺寸的适配
- 使用相对单位和弹性布局
- 提供合理的移动端体验

### 3. 性能优化
- 使用 useMemo 缓存计算结果
- 避免在渲染中创建新对象
- 合理使用主题监听器

### 4. 一致性维护
- 建立清晰的设计系统文档
- 定期审查和更新主题配置
- 确保团队成员遵循主题规范

## 调试和测试

### 主题调试工具
```tsx
function ThemeDebugger() {
    const theme = useTheme();
    
    return (
        <Frame
            Size={new UDim2(0, 300, 1, 0)}
            BackgroundColor3={theme.colors.surface}
            Position={new UDim2(1, -300, 0, 0)}
        >
            <ScrollingFrame>
                <TextLabel Text={`Primary: ${theme.colors.primary}`} />
                <TextLabel Text={`Background: ${theme.colors.background}`} />
                <TextLabel Text={`Button Height: ${theme.sizes.buttonHeight}`} />
                {/* 显示更多主题值 */}
            </ScrollingFrame>
        </Frame>
    );
}
```

### 主题一致性测试
```typescript
describe('Theme System', () => {
    it('should provide consistent color values', () => {
        const theme = getDefaultTheme();
        expect(theme.colors.primary).toBeDefined();
        expect(theme.colors.text.primary).toBeDefined();
    });
    
    it('should adapt to screen size changes', () => {
        // 测试响应式适配逻辑
    });
});
```

## 相关文档

- [视图层架构](./100_view.md)
- [Hooks 使用指南](./101_hook.md)
- [Screen 组件规范](./102_screen.md)
- [Storybook 开发指南](./103_story-book.md)
- [提供者模式](./105_view-providers.md)


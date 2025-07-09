import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useMockRequest } from "./hooks";

// 基础Provider组件 - 用于包装所有Stories
function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            {children}
        </frame>
    );
}

// 错误边界组件
function ErrorHandler({ children }: { children: React.ReactNode }) {
    // 在实际项目中，这里应该实现错误边界逻辑
    // 现在只是简单地渲染子组件
    return <>{children}</>;
}

// Storybook入口组件
export = hoarcekat(() => {
    // 启用模拟请求处理
    useMockRequest();
    
    return (
        <RootProvider>
            <ErrorHandler>
                <frame
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundTransparency={1}
                >
                    <textlabel
                        Text="Storybook 已启动"
                        Size={new UDim2(0, 300, 0, 50)}
                        Position={new UDim2(0.5, -150, 0.5, -25)}
                        BackgroundTransparency={1}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextSize={18}
                        Font={Enum.Font.GothamBold}
                        TextXAlignment={Enum.TextXAlignment.Center}
                    />
                    <textlabel
                        Text="请选择左侧的组件来查看Story"
                        Size={new UDim2(0, 400, 0, 30)}
                        Position={new UDim2(0.5, -200, 0.5, 25)}
                        BackgroundTransparency={1}
                        TextColor3={Color3.fromRGB(200, 200, 200)}
                        TextSize={14}
                        Font={Enum.Font.Gotham}
                        TextXAlignment={Enum.TextXAlignment.Center}
                    />
                </frame>
            </ErrorHandler>
        </RootProvider>
    );
});

import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { InfoPanel } from "./InfoPanel";

export = (target: GuiObject) => {
    const root = createRoot(target);
    
    const element = (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(40, 40, 40)}
        >
            {/* 默认样式 */}
            <frame
                Size={new UDim2(0.25, 0, 0.1, 0)}
                Position={new UDim2(0.1, 0, 0.25, 0)}
                BackgroundTransparency={1}
            >
                <InfoPanel />
            </frame>
            
            {/* 带文本内容 */}
            <frame
                Size={new UDim2(0.25, 0, 0.1, 0)}
                Position={new UDim2(0.4, 0, 0.25, 0)}
                BackgroundTransparency={1}
            >
                <InfoPanel content="信息面板" />
            </frame>
            
            {/* 自定义背景色 */}
            <frame
                Size={new UDim2(0.25, 0, 0.1, 0)}
                Position={new UDim2(0.1, 0, 0.45, 0)}
                BackgroundTransparency={1}
            >
                <InfoPanel 
                    content="自定义颜色"
                    backgroundColor={Color3.fromRGB(100, 150, 200)}
                />
            </frame>
            
            {/* 自定义圆角 */}
            <frame
                Size={new UDim2(0.25, 0, 0.1, 0)}
                Position={new UDim2(0.4, 0, 0.45, 0)}
                BackgroundTransparency={1}
            >
                <InfoPanel 
                    content="大圆角"
                    backgroundColor={Color3.fromRGB(150, 100, 200)}
                    cornerRadius={15}
                />
            </frame>
            
            {/* 标题 */}
            <textlabel
                Text="InfoPanel组件演示"
                Size={new UDim2(1, 0, 0.1, 0)}
                Position={new UDim2(0, 0, 0.05, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={24}
                Font={Enum.Font.GothamBold}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
        </frame>
    );
    
    root.render(element);
    
    return () => {
        try {
            root.unmount();
        } catch (err) {
            warn("InfoPanel story cleanup error:", err);
        }
    };
};

import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { IconButton } from "./IconButton";

export = (target: GuiObject) => {
    const root = createRoot(target);
    
    const element = (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(40, 40, 40)}
        >
            {/* 正常状态 */}
            <frame
                Size={new UDim2(0.15, 0, 0.2, 0)}
                Position={new UDim2(0.1, 0, 0.3, 0)}
                BackgroundTransparency={1}
            >
                <IconButton
                    onPress={() => print("正常图标按钮被点击\!")}
                    selected={false}
                />
            </frame>
            
            {/* 选中状态 */}
            <frame
                Size={new UDim2(0.15, 0, 0.2, 0)}
                Position={new UDim2(0.3, 0, 0.3, 0)}
                BackgroundTransparency={1}
            >
                <IconButton
                    onPress={() => print("选中图标按钮被点击\!")}
                    selected={true}
                    selectedColor={Color3.fromRGB(100, 150, 255)}
                />
            </frame>
            
            {/* 禁用状态 */}
            <frame
                Size={new UDim2(0.15, 0, 0.2, 0)}
                Position={new UDim2(0.5, 0, 0.3, 0)}
                BackgroundTransparency={1}
            >
                <IconButton
                    onPress={() => print("禁用图标按钮被点击\!")}
                    disabled={true}
                />
            </frame>
            
            {/* 自定义颜色 */}
            <frame
                Size={new UDim2(0.15, 0, 0.2, 0)}
                Position={new UDim2(0.7, 0, 0.3, 0)}
                BackgroundTransparency={1}
            >
                <IconButton
                    onPress={() => print("自定义颜色按钮被点击\!")}
                    selected={true}
                    selectedColor={Color3.fromRGB(255, 100, 150)}
                />
            </frame>
            
            {/* 标题 */}
            <textlabel
                Text="IconButton组件演示"
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
            warn("IconButton story cleanup error:", err);
        }
    };
};

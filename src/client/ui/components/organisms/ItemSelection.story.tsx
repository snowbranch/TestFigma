import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { ItemSelection } from "./ItemSelection";

export = (target: GuiObject) => {
    const root = createRoot(target);
    
    const element = (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(25, 25, 30)} // 深色背景
        >
            {/* 背景渐变 */}
            <uigradient
                Color={new ColorSequence([
                    new ColorSequenceKeypoint(0, Color3.fromRGB(30, 30, 35)),
                    new ColorSequenceKeypoint(1, Color3.fromRGB(20, 20, 25))
                ])}
                Rotation={45}
            />
            
            {/* 标题 */}
            <textlabel
                Text="ItemSelection 组件演示"
                Size={new UDim2(1, 0, 0.08, 0)}
                Position={new UDim2(0, 0, 0.05, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={28}
                Font={Enum.Font.GothamBold}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            {/* 说明文字 */}
            <textlabel
                Text="点击图标选择，然后点击确认按钮"
                Size={new UDim2(1, 0, 0.05, 0)}
                Position={new UDim2(0, 0, 0.13, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(200, 200, 200)}
                TextSize={16}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            <ItemSelection
                onIconSelect={(iconIndex) => {
                    print(`选择了图标: ${iconIndex}`);
                }}
                onConfirm={(selectedIcon) => {
                    print(`确认选择的图标: ${selectedIcon}`);
                }}
            />
        </frame>
    );
    
    root.render(element);
    
    return () => {
        try {
            root.unmount();
        } catch (err) {
            warn("Story cleanup error:", err);
        }
    };
};

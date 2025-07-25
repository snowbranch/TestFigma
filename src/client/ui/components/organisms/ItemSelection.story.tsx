import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { ItemSelection } from "./ItemSelection";

export = (target: GuiObject) => {
    const root = createRoot(target);
    
    const element = (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(40, 40, 45)} // 深色背景，匹配设计风格
        >
            {/* 背景渐变 */}
            <uigradient
                Color={new ColorSequence([
                    new ColorSequenceKeypoint(0, Color3.fromRGB(50, 50, 55)),
                    new ColorSequenceKeypoint(0.5, Color3.fromRGB(40, 40, 45)),
                    new ColorSequenceKeypoint(1, Color3.fromRGB(30, 30, 35))
                ])}
                Rotation={135}
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
                Text="基于设计文档实现的UI组件 - 点击图标选择，然后点击确认按钮"
                Size={new UDim2(1, 0, 0.05, 0)}
                Position={new UDim2(0, 0, 0.13, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(200, 200, 200)}
                TextSize={16}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            {/* 组件尺寸说明 */}
            <textlabel
                Text="组件尺寸: 600px × 432px (31.25% × 40% 屏幕占比)"
                Size={new UDim2(1, 0, 0.04, 0)}
                Position={new UDim2(0, 0, 0.18, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(150, 150, 150)}
                TextSize={14}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            <ItemSelection
                onIconSelect={(iconIndex) => {
                    print(`选择了图标: ${iconIndex !== undefined ? iconIndex + 1 : "无"}`);
                }}
                onConfirm={(selectedIcon) => {
                    print(`确认选择的图标: ${selectedIcon !== undefined ? selectedIcon + 1 : "无"}`);
                }}
            />
            
            {/* 功能说明 */}
            <frame
                Size={new UDim2(0.8, 0, 0.15, 0)}
                Position={new UDim2(0.1, 0, 0.82, 0)}
                BackgroundColor3={Color3.fromRGB(35, 35, 40)}
                BackgroundTransparency={0.3}
            >
                <uicorner CornerRadius={new UDim(0, 8)} />
                <textlabel
                    Text="功能特点:\n• 根据Figma设计文档1:1还原\n• 支持三个图标的选择交互\n• 立体按钮设计\n• 响应式布局适配"
                    Size={new UDim2(0.95, 0, 0.9, 0)}
                    Position={new UDim2(0.025, 0, 0.05, 0)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(180, 180, 180)}
                    TextSize={14}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Top}
                />
            </frame>
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

import React, { useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { IconGroup } from "./IconGroup";

export = (target: GuiObject) => {
    const root = createRoot(target);
    
    const element = (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(40, 40, 40)}
        >
            {/* 交互式图标组 */}
            <frame
                Size={new UDim2(0.5, 0, 0.2, 0)}
                Position={new UDim2(0.25, 0, 0.3, 0)}
                BackgroundTransparency={1}
            >
                <IconGroup
                    onIconSelect={(index) => print(`选择了图标: ${index}`)}
                />
            </frame>
            
            {/* 预选中状态 */}
            <frame
                Size={new UDim2(0.5, 0, 0.2, 0)}
                Position={new UDim2(0.25, 0, 0.55, 0)}
                BackgroundTransparency={1}
            >
                <IconGroup
                    selectedIndex={1}
                    onIconSelect={(index) => print(`选择了图标: ${index}`)}
                />
            </frame>
            
            {/* 禁用状态 */}
            <frame
                Size={new UDim2(0.5, 0, 0.2, 0)}
                Position={new UDim2(0.25, 0, 0.8, 0)}
                BackgroundTransparency={1}
            >
                <IconGroup
                    disabled={true}
                    onIconSelect={(index) => print(`禁用状态 - 选择了图标: ${index}`)}
                />
            </frame>
            
            {/* 标题 */}
            <textlabel
                Text="IconGroup组件演示"
                Size={new UDim2(1, 0, 0.08, 0)}
                Position={new UDim2(0, 0, 0.05, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={24}
                Font={Enum.Font.GothamBold}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            {/* 说明文字 */}
            <textlabel
                Text="交互式 (点击选择)"
                Size={new UDim2(1, 0, 0.05, 0)}
                Position={new UDim2(0, 0, 0.25, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(200, 200, 200)}
                TextSize={16}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            <textlabel
                Text="预选中状态"
                Size={new UDim2(1, 0, 0.05, 0)}
                Position={new UDim2(0, 0, 0.5, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(200, 200, 200)}
                TextSize={16}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            <textlabel
                Text="禁用状态"
                Size={new UDim2(1, 0, 0.05, 0)}
                Position={new UDim2(0, 0, 0.75, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(200, 200, 200)}
                TextSize={16}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
        </frame>
    );
    
    root.render(element);
    
    return () => {
        try {
            root.unmount();
        } catch (err) {
            warn("IconGroup story cleanup error:", err);
        }
    };
};

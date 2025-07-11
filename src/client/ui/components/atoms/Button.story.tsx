import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Button } from "./Button";

export = (target: GuiObject) => {
    const root = createRoot(target);
    
    const element = (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(40, 40, 40)}
        >
            {/* 正常按钮 */}
            <frame
                Size={new UDim2(0.2, 0, 0.15, 0)}
                Position={new UDim2(0.1, 0, 0.2, 0)}
                BackgroundTransparency={1}
            >
                <Button
                    onPress={() => print("正常按钮被点击\!")}
                    text="正常按钮"
                />
            </frame>
            
            {/* 禁用按钮 */}
            <frame
                Size={new UDim2(0.2, 0, 0.15, 0)}
                Position={new UDim2(0.4, 0, 0.2, 0)}
                BackgroundTransparency={1}
            >
                <Button
                    onPress={() => print("禁用按钮被点击\!")}
                    text="禁用按钮"
                    disabled={true}
                />
            </frame>
            
            {/* 自定义文本按钮 */}
            <frame
                Size={new UDim2(0.2, 0, 0.15, 0)}
                Position={new UDim2(0.7, 0, 0.2, 0)}
                BackgroundTransparency={1}
            >
                <Button
                    onPress={() => print("自定义按钮被点击\!")}
                    text="自定义"
                />
            </frame>
            
            {/* 标题 */}
            <textlabel
                Text="Button组件演示"
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
            warn("Button story cleanup error:", err);
        }
    };
};

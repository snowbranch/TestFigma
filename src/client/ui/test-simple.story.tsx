import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

// 最简单的测试Story - 不使用复杂组件
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(50, 50, 50)}
        >
            <textlabel
                Text="简单测试"
                Size={new UDim2(0, 200, 0, 50)}
                Position={new UDim2(0.5, -100, 0.5, -25)}
                BackgroundColor3={Color3.fromRGB(100, 100, 100)}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={16}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
        </frame>
    );
});
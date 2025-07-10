import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

// 简化的Title组件 - 避免使用usePx hook
function SimpleTitle({
    text,
    size,
    position,
    textColor = Color3.fromRGB(255, 255, 255),
    fontSize = 18,
    textAlignment = Enum.TextXAlignment.Center
}: {
    text: string;
    size?: UDim2;
    position?: UDim2;
    textColor?: Color3;
    fontSize?: number;
    textAlignment?: Enum.TextXAlignment;
}) {
    return (
        <textlabel
            Text={text}
            Size={size || new UDim2(1, 0, 0, 30)}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundTransparency={1}
            TextColor3={textColor}
            TextSize={fontSize}
            TextXAlignment={textAlignment}
            Font={Enum.Font.GothamBold}
        />
    );
}

// 默认标题 - 演示基本用法
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <SimpleTitle 
                text="默认标题"
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});
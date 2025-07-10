import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

// 简化的Button组件 - 避免使用usePx hook
function SimpleButton({
    text,
    onClick,
    size,
    position,
    backgroundColor = Color3.fromRGB(45, 85, 255),
    textColor = Color3.fromRGB(255, 255, 255),
    fontSize = 14
}: {
    text: string;
    onClick?: () => void;
    size?: UDim2;
    position?: UDim2;
    backgroundColor?: Color3;
    textColor?: Color3;
    fontSize?: number;
}) {
    return (
        <textbutton
            Text={text}
            Size={size || new UDim2(0, 120, 0, 40)}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundColor3={backgroundColor}
            TextColor3={textColor}
            TextSize={fontSize}
            Font={Enum.Font.GothamMedium}
            Event={{
                MouseButton1Click: onClick
            }}
        >
            <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>
    );
}

// 默认按钮 - 演示基本用法
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <SimpleButton 
                text="默认按钮"
                onClick={() => print("点击了默认按钮")}
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});
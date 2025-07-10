import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

// 简化的ItemIcon组件 - 避免使用usePx hook
function SimpleItemIcon({
    imageId,
    size = 64,
    position,
    borderColor = Color3.fromRGB(200, 200, 200),
    backgroundColor = Color3.fromRGB(50, 50, 50)
}: {
    imageId: string;
    size?: number;
    position?: UDim2;
    borderColor?: Color3;
    backgroundColor?: Color3;
}) {
    return (
        <frame
            Size={new UDim2(0, size, 0, size)}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundColor3={backgroundColor}
            BorderSizePixel={2}
            BorderColor3={borderColor}
        >
            <uicorner CornerRadius={new UDim(0, 8)} />
            <imagebutton
                Size={new UDim2(1, -4, 1, -4)}
                Position={new UDim2(0, 2, 0, 2)}
                Image={imageId}
                BackgroundTransparency={1}
                ScaleType={Enum.ScaleType.Fit}
            />
        </frame>
    );
}

// 默认图标 - 演示基本用法
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <SimpleItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});
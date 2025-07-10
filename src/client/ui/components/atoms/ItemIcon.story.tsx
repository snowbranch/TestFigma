import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { ItemIcon } from "./ItemIcon";

// 默认图标 - 演示基本用法
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});

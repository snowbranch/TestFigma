import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { ItemList, ItemData } from "./ItemList";

// 默认物品列表 - 演示基本用法
export = hoarcekat(() => {
    const items: ItemData[] = [
        { id: "1", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "剑" },
        { id: "2", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "盾" },
        { id: "3", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "药水" },
    ];

    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemList 
                items={items}
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});

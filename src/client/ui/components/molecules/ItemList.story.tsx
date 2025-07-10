import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

// 数据接口
interface ItemData {
    id: string;
    imageId: string;
    name: string;
}

// 简化的ItemIcon组件
function SimpleItemIcon({
    imageId,
    size = 64
}: {
    imageId: string;
    size?: number;
}) {
    return (
        <frame
            Size={new UDim2(0, size, 0, size)}
            BackgroundColor3={Color3.fromRGB(50, 50, 50)}
            BorderSizePixel={2}
            BorderColor3={Color3.fromRGB(200, 200, 200)}
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

// 简化的ItemList组件
function SimpleItemList({
    items,
    position,
    spacing = 20
}: {
    items: ItemData[];
    position?: UDim2;
    spacing?: number;
}) {
    return (
        <frame
            Size={new UDim2(1, 0, 0, 80)}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundTransparency={1}
        >
            <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                Padding={new UDim(0, spacing)}
            />
            {items.map((item, index) => (
                <SimpleItemIcon
                    key={item.id}
                    imageId={item.imageId}
                    size={64}
                />
            ))}
        </frame>
    );
}

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
            <SimpleItemList 
                items={items}
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});
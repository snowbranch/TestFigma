import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { ItemList, ItemData } from "./ItemList";

// 默认物品列表 - 演示基本用法
export const Default = hoarcekat(() => {
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

// 单个物品
export const SingleItem = hoarcekat(() => {
    const items: ItemData[] = [
        { id: "1", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "单个物品" }
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

// 多个物品
export const MultipleItems = hoarcekat(() => {
    const items: ItemData[] = [
        { id: "1", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "武器1" },
        { id: "2", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "武器2" },
        { id: "3", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "武器3" },
        { id: "4", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "武器4" },
        { id: "5", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "武器5" },
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

// 不同间距的物品列表
export const DifferentSpacing = hoarcekat(() => {
    const items: ItemData[] = [
        { id: "1", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "物品1" },
        { id: "2", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "物品2" },
        { id: "3", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "物品3" },
    ];

    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemList 
                items={items}
                position={new UDim2(0, 50, 0, 50)}
                spacing={10}
            />
            <ItemList 
                items={items}
                position={new UDim2(0, 50, 0, 150)}
                spacing={20}
            />
            <ItemList 
                items={items}
                position={new UDim2(0, 50, 0, 250)}
                spacing={40}
            />
        </frame>
    );
});

// 空物品列表
export const EmptyList = hoarcekat(() => {
    const items: ItemData[] = [];

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

// 大量物品列表
export const ManyItems = hoarcekat(() => {
    const items: ItemData[] = [];
    for (let i = 1; i <= 10; i++) {
        items.push({
            id: i.toString(),
            imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png",
            name: `物品${i}`
        });
    }

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

// 背包物品展示
export const InventoryDisplay = hoarcekat(() => {
    const items: ItemData[] = [
        { id: "sword", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "钢剑" },
        { id: "shield", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "钢盾" },
        { id: "potion", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "生命药水" },
        { id: "bow", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "长弓" },
        { id: "armor", imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", name: "皮甲" },
    ];

    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <frame
                Size={new UDim2(0, 500, 0, 120)}
                Position={new UDim2(0, 50, 0, 50)}
                BackgroundColor3={Color3.fromRGB(50, 50, 50)}
            >
                <uicorner CornerRadius={new UDim(0, 10)} />
                <uipadding 
                    PaddingTop={new UDim(0, 20)}
                    PaddingLeft={new UDim(0, 20)}
                    PaddingRight={new UDim(0, 20)}
                    PaddingBottom={new UDim(0, 20)}
                />
                <ItemList 
                    items={items}
                    spacing={15}
                />
            </frame>
        </frame>
    );
});

export = {
    Default,
    SingleItem,
    MultipleItems,
    DifferentSpacing,
    EmptyList,
    ManyItems,
    InventoryDisplay
};

import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { ItemIcon } from "./ItemIcon";

// 默认图标 - 演示基本用法
export const Default = hoarcekat(() => {
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

// 不同尺寸的图标
export const Sizes = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={32}
                position={new UDim2(0, 50, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={64}
                position={new UDim2(0, 100, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={96}
                position={new UDim2(0, 180, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={128}
                position={new UDim2(0, 290, 0, 50)}
            />
        </frame>
    );
});

// 不同边框颜色的图标
export const BorderColors = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(255, 255, 255)}
                position={new UDim2(0, 50, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(34, 197, 94)}
                position={new UDim2(0, 130, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(59, 130, 246)}
                position={new UDim2(0, 210, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(168, 85, 247)}
                position={new UDim2(0, 290, 0, 50)}
            />
        </frame>
    );
});

// 不同背景颜色的图标
export const BackgroundColors = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                backgroundColor={Color3.fromRGB(70, 70, 70)}
                position={new UDim2(0, 50, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                backgroundColor={Color3.fromRGB(30, 58, 138)}
                position={new UDim2(0, 130, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                backgroundColor={Color3.fromRGB(22, 101, 52)}
                position={new UDim2(0, 210, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                backgroundColor={Color3.fromRGB(88, 28, 135)}
                position={new UDim2(0, 290, 0, 50)}
            />
        </frame>
    );
});

// 稀有度表示 - 不同边框颜色表示不同稀有度
export const RarityColors = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(156, 163, 175)} // 普通 - 灰色
                position={new UDim2(0, 50, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(34, 197, 94)} // 稀有 - 绿色
                position={new UDim2(0, 130, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(59, 130, 246)} // 史诗 - 蓝色
                position={new UDim2(0, 210, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(168, 85, 247)} // 传说 - 紫色
                position={new UDim2(0, 290, 0, 50)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                borderColor={Color3.fromRGB(251, 191, 36)} // 神话 - 金色
                position={new UDim2(0, 370, 0, 50)}
            />
        </frame>
    );
});

// 物品网格演示
export const ItemGrid = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Left}
                VerticalAlignment={Enum.VerticalAlignment.Top}
                SortOrder={Enum.SortOrder.LayoutOrder}
                Padding={new UDim(0, 10)}
            />
            <uipadding
                PaddingTop={new UDim(0, 20)}
                PaddingLeft={new UDim(0, 20)}
                PaddingRight={new UDim(0, 20)}
                PaddingBottom={new UDim(0, 20)}
            />
            
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={48}
                borderColor={Color3.fromRGB(156, 163, 175)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={48}
                borderColor={Color3.fromRGB(34, 197, 94)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={48}
                borderColor={Color3.fromRGB(59, 130, 246)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={48}
                borderColor={Color3.fromRGB(168, 85, 247)}
            />
            <ItemIcon 
                imageId="rbxasset://textures/ui/GuiImagePlaceholder.png"
                size={48}
                borderColor={Color3.fromRGB(251, 191, 36)}
            />
        </frame>
    );
});

export default {
    Default,
    Sizes,
    BorderColors,
    BackgroundColors,
    RarityColors,
    ItemGrid
};

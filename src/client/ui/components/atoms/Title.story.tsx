import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Title } from "./Title";

// 默认标题 - 演示基本用法
export const Default = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Title 
                text="默认标题"
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});

// 不同字体大小的标题
export const FontSizes = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Title 
                text="小标题"
                fontSize={14}
                position={new UDim2(0, 50, 0, 50)}
            />
            <Title 
                text="中标题"
                fontSize={18}
                position={new UDim2(0, 50, 0, 90)}
            />
            <Title 
                text="大标题"
                fontSize={24}
                position={new UDim2(0, 50, 0, 130)}
            />
            <Title 
                text="超大标题"
                fontSize={32}
                position={new UDim2(0, 50, 0, 170)}
            />
        </frame>
    );
});

// 不同文本颜色的标题
export const TextColors = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Title 
                text="白色标题"
                textColor={Color3.fromRGB(255, 255, 255)}
                position={new UDim2(0, 50, 0, 50)}
            />
            <Title 
                text="蓝色标题"
                textColor={Color3.fromRGB(59, 130, 246)}
                position={new UDim2(0, 50, 0, 90)}
            />
            <Title 
                text="绿色标题"
                textColor={Color3.fromRGB(34, 197, 94)}
                position={new UDim2(0, 50, 0, 130)}
            />
            <Title 
                text="红色标题"
                textColor={Color3.fromRGB(239, 68, 68)}
                position={new UDim2(0, 50, 0, 170)}
            />
            <Title 
                text="紫色标题"
                textColor={Color3.fromRGB(168, 85, 247)}
                position={new UDim2(0, 50, 0, 210)}
            />
        </frame>
    );
});

// 不同对齐方式的标题
export const TextAlignments = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Title 
                text="左对齐标题"
                textAlignment={Enum.TextXAlignment.Left}
                size={new UDim2(0, 300, 0, 30)}
                position={new UDim2(0, 50, 0, 50)}
            />
            <Title 
                text="居中对齐标题"
                textAlignment={Enum.TextXAlignment.Center}
                size={new UDim2(0, 300, 0, 30)}
                position={new UDim2(0, 50, 0, 90)}
            />
            <Title 
                text="右对齐标题"
                textAlignment={Enum.TextXAlignment.Right}
                size={new UDim2(0, 300, 0, 30)}
                position={new UDim2(0, 50, 0, 130)}
            />
        </frame>
    );
});

// 不同尺寸的标题
export const Sizes = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Title 
                text="小尺寸标题"
                size={new UDim2(0, 200, 0, 25)}
                position={new UDim2(0, 50, 0, 50)}
                fontSize={14}
            />
            <Title 
                text="中尺寸标题"
                size={new UDim2(0, 300, 0, 35)}
                position={new UDim2(0, 50, 0, 90)}
                fontSize={18}
            />
            <Title 
                text="大尺寸标题"
                size={new UDim2(0, 400, 0, 45)}
                position={new UDim2(0, 50, 0, 140)}
                fontSize={24}
            />
        </frame>
    );
});

// 页面标题示例
export const PageTitles = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Title 
                text="商店"
                fontSize={24}
                textColor={Color3.fromRGB(255, 255, 255)}
                size={new UDim2(1, 0, 0, 40)}
                position={new UDim2(0, 0, 0, 20)}
                textAlignment={Enum.TextXAlignment.Center}
            />
            <Title 
                text="背包"
                fontSize={24}
                textColor={Color3.fromRGB(255, 255, 255)}
                size={new UDim2(1, 0, 0, 40)}
                position={new UDim2(0, 0, 0, 80)}
                textAlignment={Enum.TextXAlignment.Center}
            />
            <Title 
                text="设置"
                fontSize={24}
                textColor={Color3.fromRGB(255, 255, 255)}
                size={new UDim2(1, 0, 0, 40)}
                position={new UDim2(0, 0, 0, 140)}
                textAlignment={Enum.TextXAlignment.Center}
            />
        </frame>
    );
});

// 长文本标题
export const LongText = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Title 
                text="这是一个很长的标题文本，用于测试文本换行和显示效果"
                size={new UDim2(0, 400, 0, 60)}
                position={new UDim2(0, 50, 0, 50)}
                fontSize={16}
                textAlignment={Enum.TextXAlignment.Center}
            />
        </frame>
    );
});

export default {
    Default,
    FontSizes,
    TextColors,
    TextAlignments,
    Sizes,
    PageTitles,
    LongText
};

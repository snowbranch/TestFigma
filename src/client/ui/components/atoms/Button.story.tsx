import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Button } from "./Button";

// 默认按钮 - 演示基本用法
export const Default = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Button 
                text="默认按钮"
                onClick={() => print("点击了默认按钮")}
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});

// 不同尺寸的按钮
export const Sizes = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Button 
                text="小按钮"
                onClick={() => print("点击了小按钮")}
                size={new UDim2(0, 100, 0, 30)}
                position={new UDim2(0, 50, 0, 50)}
                fontSize={12}
            />
            <Button 
                text="中按钮"
                onClick={() => print("点击了中按钮")}
                size={new UDim2(0, 120, 0, 40)}
                position={new UDim2(0, 50, 0, 100)}
                fontSize={14}
            />
            <Button 
                text="大按钮"
                onClick={() => print("点击了大按钮")}
                size={new UDim2(0, 150, 0, 50)}
                position={new UDim2(0, 50, 0, 160)}
                fontSize={16}
            />
        </frame>
    );
});

// 不同颜色的按钮
export const Colors = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Button 
                text="蓝色按钮"
                onClick={() => print("点击了蓝色按钮")}
                backgroundColor={Color3.fromRGB(45, 85, 255)}
                position={new UDim2(0, 50, 0, 50)}
            />
            <Button 
                text="绿色按钮"
                onClick={() => print("点击了绿色按钮")}
                backgroundColor={Color3.fromRGB(34, 197, 94)}
                position={new UDim2(0, 50, 0, 110)}
            />
            <Button 
                text="红色按钮"
                onClick={() => print("点击了红色按钮")}
                backgroundColor={Color3.fromRGB(239, 68, 68)}
                position={new UDim2(0, 50, 0, 170)}
            />
            <Button 
                text="紫色按钮"
                onClick={() => print("点击了紫色按钮")}
                backgroundColor={Color3.fromRGB(168, 85, 247)}
                position={new UDim2(0, 50, 0, 230)}
            />
        </frame>
    );
});

// 禁用状态的按钮
export const Disabled = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Button 
                text="禁用按钮"
                backgroundColor={Color3.fromRGB(100, 100, 100)}
                textColor={Color3.fromRGB(150, 150, 150)}
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});

// 长文本按钮
export const LongText = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <Button 
                text="这是一个很长的按钮文本"
                onClick={() => print("点击了长文本按钮")}
                size={new UDim2(0, 250, 0, 40)}
                position={new UDim2(0, 50, 0, 50)}
            />
        </frame>
    );
});

export default {
    Default,
    Sizes,
    Colors,
    Disabled,
    LongText
};

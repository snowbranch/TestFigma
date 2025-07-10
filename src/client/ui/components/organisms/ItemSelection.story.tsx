import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { ItemSelection } from "./ItemSelection";

// 根据设计文档创建的物品选择组件 Story
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(40, 40, 40)}
        >
            <ItemSelection />
        </frame>
    );
});
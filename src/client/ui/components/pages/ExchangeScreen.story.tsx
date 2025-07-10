import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { ExchangeScreen } from "./ExchangeScreen";

// 根据设计图创建的道具交换码界面 Story
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ExchangeScreen />
        </frame>
    );
});
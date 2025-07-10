import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { ExchangeScreen } from "./ExchangeScreen";
import { useMockRequest } from "../../hooks/use-mock-request";

// 默认交换屏幕 - 演示基本用法
export = hoarcekat(() => {
    useMockRequest();
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ExchangeScreen />
        </frame>
    );
});

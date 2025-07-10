import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { ItemExchangePanel } from "./ItemExchangePanel";

// 默认交换面板 - 演示基本用法
export = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemExchangePanel 
                visible={true}
                onExchange={() => print("兑换按钮点击")}
                onClose={() => print("关闭按钮点击")}
            />
        </frame>
    );
});

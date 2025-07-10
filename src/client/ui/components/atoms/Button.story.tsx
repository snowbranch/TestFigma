import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Button } from "./Button";

// 默认按钮 - 演示基本用法
export = hoarcekat(() => {
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

import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Title } from "./Title";

// 默认标题 - 演示基本用法
export = hoarcekat(() => {
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

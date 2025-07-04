import React, { useState } from "@rbxts/react";
import { usePx } from "../../hooks";
import { Title, Button } from "../atoms";
import { ItemList, ItemData } from "../molecules";

export interface ItemExchangePanelProps {
    visible?: boolean;
    onExchange?: () => void;
    onClose?: () => void;
}

export function ItemExchangePanel({
    visible = true,
    onExchange,
    onClose
}: ItemExchangePanelProps) {
    const px = usePx();
    
    // 临时使用Roblox默认图标，实际项目中应该使用assets系统
    const exchangeItems: ItemData[] = [
        {
            id: "diamond",
            imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", // 蓝色钻石临时图标
            name: "钻石"
        },
        {
            id: "gold",
            imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", // 金币临时图标
            name: "金币"
        },
        {
            id: "emerald",
            imageId: "rbxasset://textures/ui/GuiImagePlaceholder.png", // 绿宝石临时图标
            name: "绿宝石"
        }
    ];

    if (!visible) {
        return undefined;
    }

    return (
        <screengui ResetOnSpawn={false}>
            <frame
                Size={new UDim2(0, px(320), 0, px(240))}
                Position={new UDim2(0.5, px(-160), 0.5, px(-120))}
                BackgroundColor3={Color3.fromRGB(45, 45, 60)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0, px(12))} />
                
                {/* 标题 */}
                <Title
                    text="道具交换码"
                    position={new UDim2(0, px(10), 0, px(10))}
                    size={new UDim2(1, px(-20), 0, px(30))}
                    fontSize={16}
                />
                
                {/* 物品列表 */}
                <ItemList
                    items={exchangeItems}
                    position={new UDim2(0, px(20), 0, px(60))}
                />
                
                {/* 兑换按钮 */}
                <Button
                    text="兑换交换码"
                    size={new UDim2(0, px(120), 0, px(40))}
                    position={new UDim2(0.5, px(-60), 1, px(-60))}
                    onClick={onExchange}
                    backgroundColor={Color3.fromRGB(45, 85, 255)}
                />
                
                {/* 关闭按钮 */}
                <textbutton
                    Text="×"
                    Size={new UDim2(0, px(30), 0, px(30))}
                    Position={new UDim2(1, px(-40), 0, px(10))}
                    BackgroundColor3={Color3.fromRGB(255, 100, 100)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={px(18)}
                    Font={Enum.Font.GothamBold}
                    Event={{
                        MouseButton1Click: onClose
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, px(4))} />
                </textbutton>
            </frame>
        </screengui>
    );
}

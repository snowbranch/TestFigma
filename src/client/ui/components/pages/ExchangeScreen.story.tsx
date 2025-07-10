import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";

// 简化的交换屏幕组件 - 避免复杂依赖
function SimpleExchangeScreen() {
    const [panelVisible, setPanelVisible] = useState(true);

    const handleExchange = () => {
        print("执行道具兑换！");
        setPanelVisible(false);
    };

    const handleClose = () => {
        setPanelVisible(false);
    };

    const handleReset = () => {
        setPanelVisible(true);
    };

    if (!panelVisible) {
        return (
            <frame
                Size={new UDim2(1, 0, 1, 0)}
                BackgroundColor3={Color3.fromRGB(30, 30, 30)}
            >
                <textlabel
                    Text="交换完成！"
                    Size={new UDim2(0, 200, 0, 50)}
                    Position={new UDim2(0.5, -100, 0.5, -50)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(100, 255, 100)}
                    TextSize={18}
                    Font={Enum.Font.GothamBold}
                    TextXAlignment={Enum.TextXAlignment.Center}
                />
                <textbutton
                    Text="重新显示面板"
                    Size={new UDim2(0, 120, 0, 40)}
                    Position={new UDim2(0.5, -60, 0.5, 10)}
                    BackgroundColor3={Color3.fromRGB(45, 85, 255)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: handleReset
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
            </frame>
        );
    }

    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            {/* 简化的交换面板 */}
            <frame
                Size={new UDim2(0, 320, 0, 240)}
                Position={new UDim2(0.5, -160, 0.5, -120)}
                BackgroundColor3={Color3.fromRGB(45, 45, 60)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0, 12)} />
                
                {/* 标题 */}
                <textlabel
                    Text="道具交换屏幕"
                    Position={new UDim2(0, 10, 0, 10)}
                    Size={new UDim2(1, -20, 0, 30)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={16}
                    TextXAlignment={Enum.TextXAlignment.Center}
                    Font={Enum.Font.GothamBold}
                />
                
                {/* 简单的物品展示 */}
                <frame
                    Position={new UDim2(0, 20, 0, 60)}
                    Size={new UDim2(1, -40, 0, 80)}
                    BackgroundTransparency={1}
                >
                    <uilistlayout
                        FillDirection={Enum.FillDirection.Horizontal}
                        HorizontalAlignment={Enum.HorizontalAlignment.Center}
                        Padding={new UDim(0, 20)}
                    />
                    
                    <frame
                        Size={new UDim2(0, 64, 0, 64)}
                        BackgroundColor3={Color3.fromRGB(50, 50, 50)}
                        BorderSizePixel={2}
                        BorderColor3={Color3.fromRGB(100, 150, 255)}
                    >
                        <uicorner CornerRadius={new UDim(0, 8)} />
                        <textlabel
                            Text="💎"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={24}
                            TextXAlignment={Enum.TextXAlignment.Center}
                            Font={Enum.Font.Gotham}
                        />
                    </frame>
                    
                    <frame
                        Size={new UDim2(0, 64, 0, 64)}
                        BackgroundColor3={Color3.fromRGB(50, 50, 50)}
                        BorderSizePixel={2}
                        BorderColor3={Color3.fromRGB(255, 215, 0)}
                    >
                        <uicorner CornerRadius={new UDim(0, 8)} />
                        <textlabel
                            Text="🪙"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={24}
                            TextXAlignment={Enum.TextXAlignment.Center}
                            Font={Enum.Font.Gotham}
                        />
                    </frame>
                </frame>
                
                {/* 兑换按钮 */}
                <textbutton
                    Text="兑换交换码"
                    Size={new UDim2(0, 120, 0, 40)}
                    Position={new UDim2(0.5, -60, 1, -60)}
                    BackgroundColor3={Color3.fromRGB(45, 85, 255)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: handleExchange
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                {/* 关闭按钮 */}
                <textbutton
                    Text="×"
                    Size={new UDim2(0, 30, 0, 30)}
                    Position={new UDim2(1, -40, 0, 10)}
                    BackgroundColor3={Color3.fromRGB(255, 100, 100)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={18}
                    Font={Enum.Font.GothamBold}
                    Event={{
                        MouseButton1Click: handleClose
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 4)} />
                </textbutton>
            </frame>
        </frame>
    );
}

// 默认交换屏幕 - 演示基本用法
export = hoarcekat(() => {
    return <SimpleExchangeScreen />;
});
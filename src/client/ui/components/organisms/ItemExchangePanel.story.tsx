import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { ItemExchangePanel } from "./ItemExchangePanel";

// 默认交换面板 - 演示基本用法
export const Default = hoarcekat(() => {
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

// 隐藏状态的面板
export const Hidden = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemExchangePanel 
                visible={false}
                onExchange={() => print("兑换按钮点击")}
                onClose={() => print("关闭按钮点击")}
            />
            <textlabel
                Text="面板已隐藏"
                Size={new UDim2(0, 200, 0, 50)}
                Position={new UDim2(0.5, -100, 0.5, -25)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={16}
                Font={Enum.Font.Gotham}
            />
        </frame>
    );
});

// 交互式面板 - 演示打开/关闭切换
export const Interactive = hoarcekat(() => {
    const [isVisible, setIsVisible] = useState(false);
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <textbutton
                Text={isVisible ? "隐藏面板" : "显示面板"}
                Size={new UDim2(0, 150, 0, 40)}
                Position={new UDim2(0.5, -75, 0.2, 0)}
                BackgroundColor3={Color3.fromRGB(45, 85, 255)}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={14}
                Font={Enum.Font.GothamMedium}
                Event={{
                    MouseButton1Click: () => setIsVisible(!isVisible)
                }}
            >
                <uicorner CornerRadius={new UDim(0, 8)} />
            </textbutton>
            
            <ItemExchangePanel 
                visible={isVisible}
                onExchange={() => {
                    print("兑换成功！");
                    setIsVisible(false);
                }}
                onClose={() => setIsVisible(false)}
            />
        </frame>
    );
});

// 不同状态的面板演示
export const States = hoarcekat(() => {
    const [currentState, setCurrentState] = useState<"closed" | "open" | "processing">("closed");
    
    const handleExchange = () => {
        setCurrentState("processing");
        wait(2); // 模拟处理时间
        setCurrentState("closed");
        print("兑换完成！");
    };
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <frame
                Size={new UDim2(0, 300, 0, 100)}
                Position={new UDim2(0.5, -150, 0.1, 0)}
                BackgroundColor3={Color3.fromRGB(50, 50, 50)}
            >
                <uicorner CornerRadius={new UDim(0, 10)} />
                <uilistlayout
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    Padding={new UDim(0, 10)}
                />
                
                <textbutton
                    Text="打开面板"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(34, 197, 94)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={12}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setCurrentState("open")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 6)} />
                </textbutton>
                
                <textbutton
                    Text="关闭面板"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(239, 68, 68)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={12}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setCurrentState("closed")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 6)} />
                </textbutton>
                
                <textbutton
                    Text="处理中"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(168, 85, 247)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={12}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setCurrentState("processing")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 6)} />
                </textbutton>
            </frame>
            
            <textlabel
                Text={`当前状态: ${currentState}`}
                Size={new UDim2(0, 200, 0, 30)}
                Position={new UDim2(0.5, -100, 0.25, 0)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={14}
                Font={Enum.Font.Gotham}
            />
            
            <ItemExchangePanel 
                visible={currentState === "open" || currentState === "processing"}
                onExchange={handleExchange}
                onClose={() => setCurrentState("closed")}
            />
        </frame>
    );
});

// 游戏场景中的面板
export const GameScene = hoarcekat(() => {
    const [showPanel, setShowPanel] = useState(false);
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(20, 25, 40)}
        >
            {/* 模拟游戏UI */}
            <frame
                Size={new UDim2(1, 0, 0, 80)}
                Position={new UDim2(0, 0, 0, 0)}
                BackgroundColor3={Color3.fromRGB(10, 15, 25)}
            >
                <textlabel
                    Text="游戏主界面"
                    Size={new UDim2(0, 200, 0, 40)}
                    Position={new UDim2(0, 20, 0, 20)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={18}
                    Font={Enum.Font.GothamBold}
                />
                
                <textbutton
                    Text="打开交换面板"
                    Size={new UDim2(0, 120, 0, 40)}
                    Position={new UDim2(1, -140, 0, 20)}
                    BackgroundColor3={Color3.fromRGB(251, 191, 36)}
                    TextColor3={Color3.fromRGB(0, 0, 0)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setShowPanel(true)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
            </frame>
            
            {/* 模拟游戏内容区域 */}
            <frame
                Size={new UDim2(1, 0, 1, -80)}
                Position={new UDim2(0, 0, 0, 80)}
                BackgroundColor3={Color3.fromRGB(40, 45, 60)}
            >
                <textlabel
                    Text="游戏内容区域"
                    Size={new UDim2(0, 200, 0, 40)}
                    Position={new UDim2(0.5, -100, 0.5, -20)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(200, 200, 200)}
                    TextSize={16}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                />
            </frame>
            
            <ItemExchangePanel 
                visible={showPanel}
                onExchange={() => {
                    print("兑换成功！获得了道具");
                    setShowPanel(false);
                }}
                onClose={() => setShowPanel(false)}
            />
        </frame>
    );
});

// 错误处理演示
export const ErrorHandling = hoarcekat(() => {
    const [showError, setShowError] = useState(false);
    
    const handleExchange = () => {
        // 模拟错误情况
        setShowError(true);
        wait(2);
        setShowError(false);
        print("兑换失败：余额不足");
    };
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ItemExchangePanel 
                visible={true}
                onExchange={handleExchange}
                onClose={() => print("关闭面板")}
            />
            
            {showError && (
                <frame
                    Size={new UDim2(0, 200, 0, 60)}
                    Position={new UDim2(0.5, -100, 0.8, -30)}
                    BackgroundColor3={Color3.fromRGB(239, 68, 68)}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                    <textlabel
                        Text="兑换失败！"
                        Size={new UDim2(1, 0, 1, 0)}
                        BackgroundTransparency={1}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextSize={14}
                        Font={Enum.Font.GothamMedium}
                        TextXAlignment={Enum.TextXAlignment.Center}
                    />
                </frame>
            )}
        </frame>
    );
});

export default {
    Default,
    Hidden,
    Interactive,
    States,
    GameScene,
    ErrorHandling
};

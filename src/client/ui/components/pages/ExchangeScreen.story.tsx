import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { ExchangeScreen } from "./ExchangeScreen";

// 默认交换屏幕 - 演示基本用法
export const Default = hoarcekat(() => {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <ExchangeScreen />
        </frame>
    );
});

// 在游戏UI中的交换屏幕
export const InGameUI = hoarcekat(() => {
    const [showExchange, setShowExchange] = useState(false);
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(20, 25, 40)}
        >
            {/* 模拟游戏顶部UI */}
            <frame
                Size={new UDim2(1, 0, 0, 60)}
                Position={new UDim2(0, 0, 0, 0)}
                BackgroundColor3={Color3.fromRGB(10, 15, 25)}
            >
                <textlabel
                    Text="游戏主界面"
                    Size={new UDim2(0, 200, 0, 40)}
                    Position={new UDim2(0, 20, 0, 10)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={16}
                    Font={Enum.Font.GothamBold}
                />
                
                <textlabel
                    Text="金币: 1000"
                    Size={new UDim2(0, 100, 0, 20)}
                    Position={new UDim2(1, -120, 0, 10)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(251, 191, 36)}
                    TextSize={12}
                    Font={Enum.Font.Gotham}
                />
                
                <textlabel
                    Text="钻石: 50"
                    Size={new UDim2(0, 100, 0, 20)}
                    Position={new UDim2(1, -120, 0, 30)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(59, 130, 246)}
                    TextSize={12}
                    Font={Enum.Font.Gotham}
                />
            </frame>
            
            {/* 模拟游戏底部UI */}
            <frame
                Size={new UDim2(1, 0, 0, 80)}
                Position={new UDim2(0, 0, 1, -80)}
                BackgroundColor3={Color3.fromRGB(10, 15, 25)}
            >
                <uilistlayout
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    Padding={new UDim(0, 20)}
                />
                
                <textbutton
                    Text="商店"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(45, 85, 255)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => print("打开商店")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                <textbutton
                    Text="背包"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(34, 197, 94)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => print("打开背包")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                <textbutton
                    Text="兑换"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(251, 191, 36)}
                    TextColor3={Color3.fromRGB(0, 0, 0)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setShowExchange(true)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                <textbutton
                    Text="设置"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(156, 163, 175)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => print("打开设置")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
            </frame>
            
            {/* 模拟游戏主内容区域 */}
            <frame
                Size={new UDim2(1, 0, 1, -140)}
                Position={new UDim2(0, 0, 0, 60)}
                BackgroundColor3={Color3.fromRGB(40, 45, 60)}
            >
                <textlabel
                    Text="游戏主内容区域"
                    Size={new UDim2(0, 200, 0, 40)}
                    Position={new UDim2(0.5, -100, 0.5, -20)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(200, 200, 200)}
                    TextSize={16}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                />
            </frame>
            
            {/* 兑换屏幕 */}
            {showExchange && <ExchangeScreen />}
        </frame>
    );
});

// 多个交换屏幕实例
export const MultipleInstances = hoarcekat(() => {
    const [screen1, setScreen1] = useState(false);
    const [screen2, setScreen2] = useState(false);
    const [screen3, setScreen3] = useState(false);
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <frame
                Size={new UDim2(1, 0, 0, 100)}
                Position={new UDim2(0, 0, 0, 0)}
                BackgroundColor3={Color3.fromRGB(50, 50, 50)}
            >
                <uilistlayout
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    Padding={new UDim(0, 20)}
                />
                
                <textbutton
                    Text="打开兑换1"
                    Size={new UDim2(0, 100, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(45, 85, 255)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setScreen1(true)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                <textbutton
                    Text="打开兑换2"
                    Size={new UDim2(0, 100, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(34, 197, 94)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setScreen2(true)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                <textbutton
                    Text="打开兑换3"
                    Size={new UDim2(0, 100, 0, 40)}
                    BackgroundColor3={Color3.fromRGB(168, 85, 247)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setScreen3(true)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
            </frame>
            
            {screen1 && <ExchangeScreen />}
            {screen2 && <ExchangeScreen />}
            {screen3 && <ExchangeScreen />}
        </frame>
    );
});

// 生命周期演示
export const Lifecycle = hoarcekat(() => {
    const [showScreen, setShowScreen] = useState(false);
    const [exchangeCount, setExchangeCount] = useState(0);
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <frame
                Size={new UDim2(0, 400, 0, 120)}
                Position={new UDim2(0.5, -200, 0.1, 0)}
                BackgroundColor3={Color3.fromRGB(50, 50, 50)}
            >
                <uicorner CornerRadius={new UDim(0, 10)} />
                <uipadding 
                    PaddingTop={new UDim(0, 20)}
                    PaddingLeft={new UDim(0, 20)}
                    PaddingRight={new UDim(0, 20)}
                    PaddingBottom={new UDim(0, 20)}
                />
                
                <textlabel
                    Text={`兑换次数: ${exchangeCount}`}
                    Size={new UDim2(1, 0, 0, 30)}
                    Position={new UDim2(0, 0, 0, 0)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={16}
                    Font={Enum.Font.GothamMedium}
                />
                
                <textlabel
                    Text={`屏幕状态: ${showScreen ? "显示" : "隐藏"}`}
                    Size={new UDim2(1, 0, 0, 30)}
                    Position={new UDim2(0, 0, 0, 35)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={16}
                    Font={Enum.Font.GothamMedium}
                />
                
                <textbutton
                    Text={showScreen ? "隐藏屏幕" : "显示屏幕"}
                    Size={new UDim2(0, 100, 0, 30)}
                    Position={new UDim2(0, 0, 1, -30)}
                    BackgroundColor3={showScreen ? Color3.fromRGB(239, 68, 68) : Color3.fromRGB(34, 197, 94)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setShowScreen(\!showScreen)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 6)} />
                </textbutton>
                
                <textbutton
                    Text="重置计数"
                    Size={new UDim2(0, 100, 0, 30)}
                    Position={new UDim2(1, -100, 1, -30)}
                    BackgroundColor3={Color3.fromRGB(156, 163, 175)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setExchangeCount(0)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 6)} />
                </textbutton>
            </frame>
            
            {showScreen && <ExchangeScreen />}
        </frame>
    );
});

// 响应式设计演示
export const ResponsiveDesign = hoarcekat(() => {
    const [screenSize, setScreenSize] = useState<"mobile"  < /dev/null |  "tablet" | "desktop">("desktop");
    
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={Color3.fromRGB(30, 30, 30)}
        >
            <frame
                Size={new UDim2(1, 0, 0, 60)}
                Position={new UDim2(0, 0, 0, 0)}
                BackgroundColor3={Color3.fromRGB(50, 50, 50)}
            >
                <uilistlayout
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    Padding={new UDim(0, 20)}
                />
                
                <textbutton
                    Text="手机"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={screenSize === "mobile" ? Color3.fromRGB(45, 85, 255) : Color3.fromRGB(100, 100, 100)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setScreenSize("mobile")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                <textbutton
                    Text="平板"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={screenSize === "tablet" ? Color3.fromRGB(45, 85, 255) : Color3.fromRGB(100, 100, 100)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setScreenSize("tablet")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
                
                <textbutton
                    Text="桌面"
                    Size={new UDim2(0, 80, 0, 40)}
                    BackgroundColor3={screenSize === "desktop" ? Color3.fromRGB(45, 85, 255) : Color3.fromRGB(100, 100, 100)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={14}
                    Font={Enum.Font.GothamMedium}
                    Event={{
                        MouseButton1Click: () => setScreenSize("desktop")
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                </textbutton>
            </frame>
            
            <frame
                Size={screenSize === "mobile" ? new UDim2(0, 400, 0, 600) : 
                      screenSize === "tablet" ? new UDim2(0, 600, 0, 700) : 
                      new UDim2(0, 800, 0, 800)}
                Position={new UDim2(0.5, screenSize === "mobile" ? -200 : 
                                        screenSize === "tablet" ? -300 : -400, 
                                    0.5, screenSize === "mobile" ? -300 : 
                                        screenSize === "tablet" ? -350 : -400)}
                BackgroundColor3={Color3.fromRGB(40, 45, 60)}
            >
                <uicorner CornerRadius={new UDim(0, 10)} />
                <textlabel
                    Text={`${screenSize} 视图`}
                    Size={new UDim2(1, 0, 0, 50)}
                    Position={new UDim2(0, 0, 0, 10)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={18}
                    Font={Enum.Font.GothamBold}
                    TextXAlignment={Enum.TextXAlignment.Center}
                />
                
                <ExchangeScreen />
            </frame>
        </frame>
    );
});

export = {
    Default,
    InGameUI,
    MultipleInstances,
    Lifecycle,
    ResponsiveDesign
};

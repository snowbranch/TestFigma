import React from "@rbxts/react";

// 根据设计图创建的道具交换码界面
export function ExchangeScreen() {
    const handleExchange = () => {
        print("兑换交换码被点击！");
        // 这里应该添加实际的兑换逻辑
    };

    return (
        <frame
            Size={new UDim2(0, 280, 0, 200)}
            Position={new UDim2(0.5, -140, 0.5, -100)}
            BackgroundColor3={Color3.fromRGB(52, 58, 78)} // 深蓝灰色背景，匹配设计图
            BorderSizePixel={0}
        >
            <uicorner CornerRadius={new UDim(0, 12)} />
            
            {/* 标题 - "道具交换码" */}
            <textlabel
                Text="道具交换码"
                Size={new UDim2(1, 0, 0, 40)}
                Position={new UDim2(0, 0, 0, 15)}
                BackgroundTransparency={1}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={16}
                Font={Enum.Font.GothamBold}
                TextXAlignment={Enum.TextXAlignment.Center}
            />
            
            {/* 物品图标容器 */}
            <frame
                Size={new UDim2(1, -40, 0, 80)}
                Position={new UDim2(0, 20, 0, 60)}
                BackgroundTransparency={1}
            >
                <uilistlayout
                    FillDirection={Enum.FillDirection.Horizontal}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    Padding={new UDim(0, 15)}
                />
                
                {/* 左侧蓝色星形图标 */}
                <frame
                    Size={new UDim2(0, 60, 0, 60)}
                    BackgroundColor3={Color3.fromRGB(65, 105, 180)} // 钢蓝色
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                    {/* 星形图标内容 */}
                    <frame
                        Size={new UDim2(0, 40, 0, 40)}
                        Position={new UDim2(0.5, -20, 0.5, -20)}
                        BackgroundColor3={Color3.fromRGB(100, 150, 255)} // 亮蓝色
                        BorderSizePixel={0}
                    >
                        <uicorner CornerRadius={new UDim(0, 20)} />
                        <textlabel
                            Text="★"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={20}
                            Font={Enum.Font.GothamBold}
                            TextXAlignment={Enum.TextXAlignment.Center}
                        />
                    </frame>
                </frame>
                
                {/* 中间黄色圆形图标 */}
                <frame
                    Size={new UDim2(0, 60, 0, 60)}
                    BackgroundColor3={Color3.fromRGB(218, 165, 32)} // 金棒色
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                    {/* 圆形图标内容 */}
                    <frame
                        Size={new UDim2(0, 40, 0, 40)}
                        Position={new UDim2(0.5, -20, 0.5, -20)}
                        BackgroundColor3={Color3.fromRGB(255, 215, 0)} // 金色
                        BorderSizePixel={0}
                    >
                        <uicorner CornerRadius={new UDim(0, 20)} />
                        <textlabel
                            Text="●"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={20}
                            Font={Enum.Font.GothamBold}
                            TextXAlignment={Enum.TextXAlignment.Center}
                        />
                    </frame>
                </frame>
                
                {/* 右侧蓝绿色菱形图标 */}
                <frame
                    Size={new UDim2(0, 60, 0, 60)}
                    BackgroundColor3={Color3.fromRGB(32, 178, 170)} // 浅海绿色
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                    {/* 菱形图标内容 */}
                    <frame
                        Size={new UDim2(0, 40, 0, 40)}
                        Position={new UDim2(0.5, -20, 0.5, -20)}
                        BackgroundColor3={Color3.fromRGB(64, 224, 208)} // 绿松石色
                        BorderSizePixel={0}
                        Rotation={45}
                    >
                        <uicorner CornerRadius={new UDim(0, 6)} />
                        <textlabel
                            Text="♦"
                            Size={new UDim2(1, 0, 1, 0)}
                            Position={new UDim2(0, 0, 0, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={16}
                            Font={Enum.Font.GothamBold}
                            TextXAlignment={Enum.TextXAlignment.Center}
                            Rotation={-45}
                        />
                    </frame>
                </frame>
            </frame>
            
            {/* 兑换交换码按钮 */}
            <textbutton
                Text="兑换交换码"
                Size={new UDim2(0, 120, 0, 35)}
                Position={new UDim2(0.5, -60, 1, -50)}
                BackgroundColor3={Color3.fromRGB(70, 130, 180)} // 钢蓝色，匹配设计
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={14}
                Font={Enum.Font.GothamMedium}
                Event={{
                    MouseButton1Click: handleExchange
                }}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
            </textbutton>
        </frame>
    );
}
import React, { useState } from "@rbxts/react";

// 根据 docs/item-selection-design-spec.md 创建的物品选择组件
// 整体尺寸: 200px × 144px
export function ItemSelection() {
    const [selectedIcon, setSelectedIcon] = useState<number | undefined>(undefined);

    const handleIconClick = (iconIndex: number) => {
        setSelectedIcon(iconIndex === selectedIcon ? undefined : iconIndex);
        print(`点击图标 ${iconIndex}`);
    };

    const handleButtonClick = () => {
        print("按钮被点击！");
        if (selectedIcon !== undefined) {
            print(`当前选中图标: ${selectedIcon}`);
        }
    };

    return (
        <frame
            Size={new UDim2(0, 200, 0, 144)}
            Position={new UDim2(0.5, -100, 0.5, -72)}
            BackgroundTransparency={1}
        >
            {/* 顶部信息区域 - 184px × 14px, 位置 (8px, 20px) */}
            <frame
                Size={new UDim2(0, 184, 0, 14)}
                Position={new UDim2(0, 8, 0, 20)}
                BackgroundColor3={Color3.fromRGB(80, 80, 80)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0, 2)} />
            </frame>

            {/* 中间图标选择区域 - 92px × 28px, 位置 (8px, 42px) */}
            <frame
                Size={new UDim2(0, 92, 0, 28)}
                Position={new UDim2(0, 8, 0, 42)}
                BackgroundTransparency={1}
            >
                {/* 左侧图标容器 - 28px × 28px, 位置 (0px, 0px) */}
                <textbutton
                    Size={new UDim2(0, 28, 0, 28)}
                    Position={new UDim2(0, 0, 0, 0)}
                    BackgroundColor3={selectedIcon === 0 ? Color3.fromRGB(100, 150, 255) : Color3.fromRGB(60, 60, 60)}
                    BorderSizePixel={selectedIcon === 0 ? 2 : 1}
                    BorderColor3={selectedIcon === 0 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(100, 100, 100)}
                    Text=""
                    Event={{
                        MouseButton1Click: () => handleIconClick(0)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 4)} />
                    <textlabel
                        Text="◆"
                        Size={new UDim2(1, 0, 1, 0)}
                        BackgroundTransparency={1}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextSize={14}
                        Font={Enum.Font.GothamBold}
                        TextXAlignment={Enum.TextXAlignment.Center}
                    />
                </textbutton>

                {/* 中间图标容器 - 28px × 28px, 位置 (32px, 0px) */}
                <textbutton
                    Size={new UDim2(0, 28, 0, 28)}
                    Position={new UDim2(0, 32, 0, 0)}
                    BackgroundColor3={selectedIcon === 1 ? Color3.fromRGB(255, 200, 50) : Color3.fromRGB(60, 60, 60)}
                    BorderSizePixel={selectedIcon === 1 ? 2 : 1}
                    BorderColor3={selectedIcon === 1 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(100, 100, 100)}
                    Text=""
                    Event={{
                        MouseButton1Click: () => handleIconClick(1)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 4)} />
                    <textlabel
                        Text="●"
                        Size={new UDim2(1, 0, 1, 0)}
                        BackgroundTransparency={1}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextSize={14}
                        Font={Enum.Font.GothamBold}
                        TextXAlignment={Enum.TextXAlignment.Center}
                    />
                </textbutton>

                {/* 右侧图标容器 - 28px × 28px, 位置 (64px, 0px) */}
                <textbutton
                    Size={new UDim2(0, 28, 0, 28)}
                    Position={new UDim2(0, 64, 0, 0)}
                    BackgroundColor3={selectedIcon === 2 ? Color3.fromRGB(50, 200, 150) : Color3.fromRGB(60, 60, 60)}
                    BorderSizePixel={selectedIcon === 2 ? 2 : 1}
                    BorderColor3={selectedIcon === 2 ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(100, 100, 100)}
                    Text=""
                    Event={{
                        MouseButton1Click: () => handleIconClick(2)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0, 4)} />
                    <textlabel
                        Text="★"
                        Size={new UDim2(1, 0, 1, 0)}
                        BackgroundTransparency={1}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextSize={14}
                        Font={Enum.Font.GothamBold}
                        TextXAlignment={Enum.TextXAlignment.Center}
                    />
                </textbutton>
            </frame>

            {/* 底部操作按钮区域 - 74px × 20px, 位置 (63px, 117px) */}
            <frame
                Size={new UDim2(0, 74, 0, 20)}
                Position={new UDim2(0, 63, 0, 117)}
                BackgroundTransparency={1}
            >
                {/* 按钮外层框架 */}
                <frame
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundColor3={Color3.fromRGB(24, 19, 30)} // #18131e
                    BorderSizePixel={1}
                    BorderColor3={Color3.fromRGB(140, 140, 140)} // #8c8c8c
                >
                    <uicorner CornerRadius={new UDim(0, 2)} />
                    
                    {/* 按钮表面层 - 70px × 16px, 位置 (2px, 2px) */}
                    <textbutton
                        Size={new UDim2(0, 70, 0, 16)}
                        Position={new UDim2(0, 2, 0, 2)}
                        Text=""
                        BorderSizePixel={0}
                        Event={{
                            MouseButton1Click: handleButtonClick
                        }}
                    >
                        <uicorner CornerRadius={new UDim(0, 1)} />
                        
                        {/* 线性渐变效果 - 从 #f6f9f8 到 #dcdcdc */}
                        <frame
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundColor3={Color3.fromRGB(246, 249, 248)} // #f6f9f8
                            BorderSizePixel={0}
                        >
                            <uicorner CornerRadius={new UDim(0, 1)} />
                            <uigradient
                                Color={new ColorSequence([
                                    new ColorSequenceKeypoint(0, Color3.fromRGB(246, 249, 248)), // #f6f9f8
                                    new ColorSequenceKeypoint(1, Color3.fromRGB(220, 220, 220))  // #dcdcdc
                                ])}
                                Rotation={45} // 从左上到右下
                            />
                        </frame>
                        
                        {/* 按钮文字 */}
                        <textlabel
                            Text="确认"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(50, 50, 50)}
                            TextSize={10}
                            Font={Enum.Font.GothamMedium}
                            TextXAlignment={Enum.TextXAlignment.Center}
                        />
                    </textbutton>
                </frame>
            </frame>

            {/* 选中状态提示 */}
            {selectedIcon !== undefined && (
                <textlabel
                    Text={`已选中图标 ${selectedIcon + 1}`}
                    Size={new UDim2(1, 0, 0, 12)}
                    Position={new UDim2(0, 0, 0, 78)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(150, 255, 150)}
                    TextSize={8}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                />
            )}
        </frame>
    );
}
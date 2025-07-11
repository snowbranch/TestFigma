import React, { useState } from "@rbxts/react";

interface ItemSelectionProps {
    onIconSelect?: (iconIndex: number | undefined) => void;
    onConfirm?: (selectedIcon: number | undefined) => void;
}

export function ItemSelection({ onIconSelect, onConfirm }: ItemSelectionProps) {
    const [selectedIcon, setSelectedIcon] = useState<number | undefined>(undefined);

    const handleIconClick = (iconIndex: number) => {
        const newSelection = iconIndex === selectedIcon ? undefined : iconIndex;
        setSelectedIcon(newSelection);
        onIconSelect?.(newSelection);
    };

    const handleConfirmClick = () => {
        onConfirm?.(selectedIcon);
    };

    return (
        <frame
            Size={new UDim2(0.3125, 0, 0.4, 0)} // 31.25% × 40% 屏幕占比
            Position={new UDim2(0.5, 0, 0.5, 0)} // 居中
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundTransparency={1}
        >
            {/* 顶部信息区域 - 28.75% × 3.89% 屏幕占比, 位置 (4%, 13.89%) */}
            <frame
                Size={new UDim2(0.92, 0, 0.0972, 0)} // 相对于父容器：552/600 × 42/432
                Position={new UDim2(0.04, 0, 0.1389, 0)} // 相对于父容器：24/600 × 60/432
                BackgroundColor3={Color3.fromRGB(80, 80, 80)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
            </frame>

            {/* 中间图标选择区域 - 14.38% × 7.78% 屏幕占比, 位置 (4%, 29.17%) */}
            <frame
                Size={new UDim2(0.46, 0, 0.1944, 0)} // 相对于父容器：276/600 × 84/432
                Position={new UDim2(0.04, 0, 0.2917, 0)} // 相对于父容器：24/600 × 126/432
                BackgroundTransparency={1}
            >
                {/* 左侧图标容器 - 4.38% × 7.78% 屏幕占比, 位置 (0%, 0%) */}
                <frame
                    Size={new UDim2(0.3043, 0, 1, 0)} // 相对于图标区：84/276 × 84/84
                    Position={new UDim2(0, 0, 0, 0)}
                    BackgroundTransparency={1}
                >
                    {/* 背景矢量 - 作为按钮 */}
                    <imagebutton
                        Size={new UDim2(1, 0, 1, 0)}
                        Position={new UDim2(0, 0, 0, 0)}
                        BackgroundColor3={
                            selectedIcon === 0 
                                ? Color3.fromRGB(100, 150, 255) 
                                : Color3.fromRGB(60, 60, 60)
                        }
                        BorderSizePixel={selectedIcon === 0 ? 6 : 3} // 3倍放大：2*3=6, 1*3=3
                        BorderColor3={
                            selectedIcon === 0 
                                ? Color3.fromRGB(255, 255, 255) 
                                : Color3.fromRGB(100, 100, 100)
                        }
                        Image=""
                        Event={{
                            MouseButton1Click: () => handleIconClick(0)
                        }}
                    >
                        <uicorner CornerRadius={new UDim(0, 12)} />
                        
                        {/* 前景矢量 - 图标内容 */}
                        <imagelabel
                            Size={new UDim2(0.857, 0, 0.714, 0)} // 相对于背景：72/84 × 60/84 (24*3/28*3)
                            Position={new UDim2(0.0714, 0, 0.0714, 0)} // 相对于背景：6/84 × 6/84 (2*3/28*3)
                            BackgroundTransparency={1}
                            Image=""
                            ImageColor3={Color3.fromRGB(255, 255, 255)}
                            ScaleType={Enum.ScaleType.Fit}
                        />
                    </imagebutton>
                </frame>

                {/* 中间图标容器 - 4.38% × 7.78% 屏幕占比, 位置 (34.78%, 0%) */}
                <frame
                    Size={new UDim2(0.3043, 0, 1, 0)} // 相对于图标区：84/276 × 84/84
                    Position={new UDim2(0.3478, 0, 0, 0)} // 相对于图标区：96/276
                    BackgroundTransparency={1}
                >
                    {/* 背景矢量 - 作为按钮 */}
                    <imagebutton
                        Size={new UDim2(1, 0, 1, 0)}
                        Position={new UDim2(0, 0, 0, 0)}
                        BackgroundColor3={
                            selectedIcon === 1 
                                ? Color3.fromRGB(255, 200, 50) 
                                : Color3.fromRGB(60, 60, 60)
                        }
                        BorderSizePixel={selectedIcon === 1 ? 6 : 3} // 3倍放大：2*3=6, 1*3=3
                        BorderColor3={
                            selectedIcon === 1 
                                ? Color3.fromRGB(255, 255, 255) 
                                : Color3.fromRGB(100, 100, 100)
                        }
                        Image=""
                        Event={{
                            MouseButton1Click: () => handleIconClick(1)
                        }}
                    >
                        <uicorner CornerRadius={new UDim(0, 12)} />
                        
                        {/* 前景矢量 - 图标内容 */}
                        <imagelabel
                            Size={new UDim2(0.857, 0, 0.714, 0)} // 相对于背景：72/84 × 60/84 (24*3/28*3)
                            Position={new UDim2(0.0714, 0, 0.0714, 0)} // 相对于背景：6/84 × 6/84 (2*3/28*3)
                            BackgroundTransparency={1}
                            Image=""
                            ImageColor3={Color3.fromRGB(255, 255, 255)}
                            ScaleType={Enum.ScaleType.Fit}
                        />
                    </imagebutton>
                </frame>

                {/* 右侧图标容器 - 4.38% × 7.78% 屏幕占比, 位置 (69.57%, 0%) */}
                <frame
                    Size={new UDim2(0.3043, 0, 1, 0)} // 相对于图标区：84/276 × 84/84
                    Position={new UDim2(0.6957, 0, 0, 0)} // 相对于图标区：192/276
                    BackgroundTransparency={1}
                >
                    {/* 背景矢量 - 作为按钮 */}
                    <imagebutton
                        Size={new UDim2(1, 0, 1, 0)}
                        Position={new UDim2(0, 0, 0, 0)}
                        BackgroundColor3={
                            selectedIcon === 2 
                                ? Color3.fromRGB(50, 200, 150) 
                                : Color3.fromRGB(60, 60, 60)
                        }
                        BorderSizePixel={selectedIcon === 2 ? 6 : 3} // 3倍放大：2*3=6, 1*3=3
                        BorderColor3={
                            selectedIcon === 2 
                                ? Color3.fromRGB(255, 255, 255) 
                                : Color3.fromRGB(100, 100, 100)
                        }
                        Image=""
                        Event={{
                            MouseButton1Click: () => handleIconClick(2)
                        }}
                    >
                        <uicorner CornerRadius={new UDim(0, 12)} />
                        
                        {/* 前景矢量 - 图标内容 */}
                        <imagelabel
                            Size={new UDim2(0.857, 0, 0.714, 0)} // 相对于背景：72/84 × 60/84 (24*3/28*3)
                            Position={new UDim2(0.0714, 0, 0.0714, 0)} // 相对于背景：6/84 × 6/84 (2*3/28*3)
                            BackgroundTransparency={1}
                            Image=""
                            ImageColor3={Color3.fromRGB(255, 255, 255)}
                            ScaleType={Enum.ScaleType.Fit}
                        />
                    </imagebutton>
                </frame>
            </frame>

            {/* 底部操作按钮区域 - 11.56% × 5.56% 屏幕占比, 位置 (31.5%, 81.25%) */}
            <frame
                Size={new UDim2(0.37, 0, 0.1389, 0)} // 相对于父容器：222/600 × 60/432
                Position={new UDim2(0.315, 0, 0.8125, 0)} // 相对于父容器：189/600 × 351/432
                BackgroundTransparency={1}
            >
                {/* 按钮主体 - 深色背景和边框 */}
                <frame
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundColor3={Color3.fromRGB(24, 19, 30)} // #18131e
                    BorderSizePixel={3} // 3倍放大：1*3=3
                    BorderColor3={Color3.fromRGB(140, 140, 140)} // #8c8c8c
                >
                    <uicorner CornerRadius={new UDim(0, 6)} />
                    
                    {/* 按钮表面层 - 10.94% × 4.44% 屏幕占比, 位置 (2.7%, 10%) */}
                    <textbutton
                        Size={new UDim2(0.946, 0, 0.8, 0)} // 相对于按钮主体：210/222 × 48/60
                        Position={new UDim2(0.027, 0, 0.1, 0)} // 相对于按钮主体：6/222 × 6/60
                        Text=""
                        BorderSizePixel={0}
                        BackgroundTransparency={1}
                        Event={{
                            MouseButton1Click: handleConfirmClick
                        }}
                    >
                        {/* 渐变背景层 */}
                        <frame
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundColor3={Color3.fromRGB(246, 249, 248)} // #f6f9f8
                            BorderSizePixel={0}
                        >
                            <uicorner CornerRadius={new UDim(0, 3)} />
                            <uigradient
                                Color={new ColorSequence([
                                    new ColorSequenceKeypoint(0, Color3.fromRGB(246, 249, 248)), // #f6f9f8
                                    new ColorSequenceKeypoint(1, Color3.fromRGB(220, 220, 220))  // #dcdcdc
                                ])}
                                Rotation={45}
                            />
                        </frame>
                        
                        {/* 按钮文字 */}
                        <textlabel
                            Text="确认"
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundTransparency={1}
                            TextColor3={Color3.fromRGB(50, 50, 50)}
                            TextSize={30} // 3倍放大：10*3=30
                            Font={Enum.Font.GothamMedium}
                            TextXAlignment={Enum.TextXAlignment.Center}
                            TextYAlignment={Enum.TextYAlignment.Center}
                        />
                    </textbutton>
                </frame>
            </frame>

            {/* 选中状态提示 */}
            {selectedIcon !== undefined && (
                <textlabel
                    Text={`已选中图标 ${selectedIcon + 1}`}
                    Size={new UDim2(1, 0, 0.0833, 0)} // 相对于父容器：36/432 (12*3/432)
                    Position={new UDim2(0, 0, 0.5417, 0)} // 相对于父容器：234/432 (78*3/432)
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(150, 255, 150)}
                    TextSize={24} // 3倍放大：8*3=24
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                    TextYAlignment={Enum.TextYAlignment.Center}
                />
            )}
        </frame>
    );
}

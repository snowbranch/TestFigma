import React, { useState } from "@rbxts/react";
import { usePx } from "../../hooks/use-px";

interface ItemSelectionProps {
    onIconSelect?: (iconIndex: number | undefined) => void;
    onConfirm?: (selectedIcon: number | undefined) => void;
}

export function ItemSelection({ onIconSelect, onConfirm }: ItemSelectionProps) {
    const px = usePx();
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
            Size={new UDim2(0, px(200), 0, px(144))}
            Position={new UDim2(0.5, px(-100), 0.5, px(-72))}
            BackgroundTransparency={1}
        >
            {/* 顶部信息区域 - 184px × 14px, 位置 (8px, 20px) */}
            <frame
                Size={new UDim2(0, px(184), 0, px(14))}
                Position={new UDim2(0, px(8), 0, px(20))}
                BackgroundColor3={Color3.fromRGB(80, 80, 80)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0, px(2))} />
            </frame>

            {/* 中间图标选择区域 - 92px × 28px, 位置 (8px, 42px) */}
            <frame
                Size={new UDim2(0, px(92), 0, px(28))}
                Position={new UDim2(0, px(8), 0, px(42))}
                BackgroundTransparency={1}
            >
                {/* 左侧图标容器 - 28px × 28px, 位置 (0px, 0px) */}
                <imagebutton
                    Size={new UDim2(0, px(28), 0, px(28))}
                    Position={new UDim2(0, px(0), 0, px(0))}
                    BackgroundColor3={
                        selectedIcon === 0 
                            ? Color3.fromRGB(100, 150, 255) 
                            : Color3.fromRGB(60, 60, 60)
                    }
                    BorderSizePixel={selectedIcon === 0 ? 2 : 1}
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
                    <uicorner CornerRadius={new UDim(0, px(4))} />
                </imagebutton>

                {/* 中间图标容器 - 28px × 28px, 位置 (32px, 0px) */}
                <imagebutton
                    Size={new UDim2(0, px(28), 0, px(28))}
                    Position={new UDim2(0, px(32), 0, px(0))}
                    BackgroundColor3={
                        selectedIcon === 1 
                            ? Color3.fromRGB(255, 200, 50) 
                            : Color3.fromRGB(60, 60, 60)
                    }
                    BorderSizePixel={selectedIcon === 1 ? 2 : 1}
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
                    <uicorner CornerRadius={new UDim(0, px(4))} />
                </imagebutton>

                {/* 右侧图标容器 - 28px × 28px, 位置 (64px, 0px) */}
                <imagebutton
                    Size={new UDim2(0, px(28), 0, px(28))}
                    Position={new UDim2(0, px(64), 0, px(0))}
                    BackgroundColor3={
                        selectedIcon === 2 
                            ? Color3.fromRGB(50, 200, 150) 
                            : Color3.fromRGB(60, 60, 60)
                    }
                    BorderSizePixel={selectedIcon === 2 ? 2 : 1}
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
                    <uicorner CornerRadius={new UDim(0, px(4))} />
                </imagebutton>
            </frame>

            {/* 底部操作按钮区域 - 74px × 20px, 位置 (63px, 117px) */}
            <frame
                Size={new UDim2(0, px(74), 0, px(20))}
                Position={new UDim2(0, px(63), 0, px(117))}
                BackgroundTransparency={1}
            >
                {/* 按钮主体 - 深色背景和边框 */}
                <frame
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundColor3={Color3.fromRGB(24, 19, 30)} // #18131e
                    BorderSizePixel={1}
                    BorderColor3={Color3.fromRGB(140, 140, 140)} // #8c8c8c
                >
                    <uicorner CornerRadius={new UDim(0, px(2))} />
                    
                    {/* 按钮表面层 - 70px × 16px, 位置 (2px, 2px) */}
                    <textbutton
                        Size={new UDim2(0, px(70), 0, px(16))}
                        Position={new UDim2(0, px(2), 0, px(2))}
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
                            <uicorner CornerRadius={new UDim(0, px(1))} />
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
                            TextSize={px(10)}
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
                    Size={new UDim2(1, 0, 0, px(12))}
                    Position={new UDim2(0, px(0), 0, px(78))}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(150, 255, 150)}
                    TextSize={px(8)}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                    TextYAlignment={Enum.TextYAlignment.Center}
                />
            )}
        </frame>
    );
}

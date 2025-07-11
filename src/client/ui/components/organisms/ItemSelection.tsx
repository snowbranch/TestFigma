import React, { useState } from "@rbxts/react";
import { Button, InfoPanel } from "../atoms";
import { IconGroup } from "../molecules";

interface ItemSelectionProps {
    onIconSelect?: (iconIndex: number | undefined) => void;
    onConfirm?: (selectedIcon: number | undefined) => void;
    disabled?: boolean;
    showStatusText?: boolean;
}

export function ItemSelection({ 
    onIconSelect, 
    onConfirm, 
    disabled = false,
    showStatusText = true
}: ItemSelectionProps) {
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
            BackgroundColor3={Color3.fromRGB(45, 45, 50)} // 深灰色背景
            BorderSizePixel={2}
            BorderColor3={Color3.fromRGB(80, 80, 85)} // 浅灰色边框
        >
            <uicorner CornerRadius={new UDim(0, 12)} />
            
            {/* 背景渐变效果 */}
            <frame
                Size={new UDim2(1, 0, 1, 0)}
                BackgroundTransparency={1}
                ZIndex={-1}
            >
                <uigradient
                    Color={new ColorSequence([
                        new ColorSequenceKeypoint(0, Color3.fromRGB(50, 50, 55)),
                        new ColorSequenceKeypoint(0.5, Color3.fromRGB(45, 45, 50)),
                        new ColorSequenceKeypoint(1, Color3.fromRGB(40, 40, 45))
                    ])}
                    Rotation={135} // 从左上到右下的对角渐变
                />
            </frame>
            {/* 顶部信息区域 - 28.75% × 3.89% 屏幕占比, 位置 (4%, 13.89%) */}
            <frame
                Size={new UDim2(0.92, 0, 0.0972, 0)} // 相对于父容器：552/600 × 42/432
                Position={new UDim2(0.04, 0, 0.1389, 0)} // 相对于父容器：24/600 × 60/432
                BackgroundTransparency={1}
            >
                <InfoPanel />
            </frame>

            {/* 中间图标选择区域 - 14.38% × 7.78% 屏幕占比, 位置 (4%, 29.17%) */}
            <frame
                Size={new UDim2(0.46, 0, 0.1944, 0)} // 相对于父容器：276/600 × 84/432
                Position={new UDim2(0.04, 0, 0.2917, 0)} // 相对于父容器：24/600 × 126/432
                BackgroundTransparency={1}
            >
                <IconGroup
                    selectedIndex={selectedIcon}
                    onIconSelect={handleIconClick}
                    disabled={disabled}
                />
            </frame>

            {/* 底部操作按钮区域 - 11.56% × 5.56% 屏幕占比, 位置 (31.5%, 81.25%) */}
            <frame
                Size={new UDim2(0.37, 0, 0.1389, 0)} // 相对于父容器：222/600 × 60/432
                Position={new UDim2(0.315, 0, 0.8125, 0)} // 相对于父容器：189/600 × 351/432
                BackgroundTransparency={1}
            >
                <Button
                    onPress={handleConfirmClick}
                    text="确认"
                    disabled={disabled}
                />
            </frame>

            {/* 选中状态提示 */}
            {showStatusText && selectedIcon !== undefined && (
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

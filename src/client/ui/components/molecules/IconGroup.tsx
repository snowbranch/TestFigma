import React from "@rbxts/react";
import { IconButton } from "../atoms";

interface IconGroupProps {
    selectedIndex?: number;
    onIconSelect?: (index: number) => void;
    icons?: string[];
    disabled?: boolean;
}

export function IconGroup({ 
    selectedIndex, 
    onIconSelect, 
    icons = ["rbxasset://textures/ui/GuiImagePlaceholder.png", "rbxasset://textures/ui/GuiImagePlaceholder.png", "rbxasset://textures/ui/GuiImagePlaceholder.png"],
    disabled = false
}: IconGroupProps) {
    const iconColors = [
        Color3.fromRGB(100, 150, 255),
        Color3.fromRGB(255, 200, 50),
        Color3.fromRGB(50, 200, 150)
    ];

    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundTransparency={1}
        >
            {/* 左侧图标容器 */}
            <frame
                Size={new UDim2(0.3043, 0, 1, 0)}
                Position={new UDim2(0, 0, 0, 0)}
                BackgroundTransparency={1}
            >
                <IconButton
                    onPress={() => onIconSelect?.(0)}
                    selected={selectedIndex === 0}
                    disabled={disabled}
                    image={icons[0]}
                    selectedColor={iconColors[0]}
                />
            </frame>

            {/* 中间图标容器 */}
            <frame
                Size={new UDim2(0.3043, 0, 1, 0)}
                Position={new UDim2(0.3478, 0, 0, 0)}
                BackgroundTransparency={1}
            >
                <IconButton
                    onPress={() => onIconSelect?.(1)}
                    selected={selectedIndex === 1}
                    disabled={disabled}
                    image={icons[1]}
                    selectedColor={iconColors[1]}
                />
            </frame>

            {/* 右侧图标容器 */}
            <frame
                Size={new UDim2(0.3043, 0, 1, 0)}
                Position={new UDim2(0.6957, 0, 0, 0)}
                BackgroundTransparency={1}
            >
                <IconButton
                    onPress={() => onIconSelect?.(2)}
                    selected={selectedIndex === 2}
                    disabled={disabled}
                    image={icons[2]}
                    selectedColor={iconColors[2]}
                />
            </frame>
        </frame>
    );
}

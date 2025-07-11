import React from "@rbxts/react";

interface IconButtonProps {
    onPress?: () => void;
    selected?: boolean;
    disabled?: boolean;
    image?: string;
    selectedColor?: Color3;
    normalColor?: Color3;
}

export function IconButton({ 
    onPress, 
    selected = false, 
    disabled = false,
    image = "rbxasset://textures/ui/GuiImagePlaceholder.png",
    selectedColor = Color3.fromRGB(100, 150, 255),
    normalColor = Color3.fromRGB(60, 60, 60)
}: IconButtonProps) {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundTransparency={1}
        >
            <imagebutton
                Size={new UDim2(1, 0, 1, 0)}
                Position={new UDim2(0, 0, 0, 0)}
                BackgroundColor3={selected ? selectedColor : normalColor}
                BorderSizePixel={selected ? 6 : 3}
                BorderColor3={
                    selected 
                        ? Color3.fromRGB(255, 255, 255) 
                        : Color3.fromRGB(100, 100, 100)
                }
                Image={image}
                BackgroundTransparency={disabled ? 0.5 : 0}
                Active={!disabled}
                Event={{
                    MouseButton1Click: disabled ? undefined : onPress
                }}
            >
                <uicorner CornerRadius={new UDim(0, 12)} />
                
                <imagelabel
                    Size={new UDim2(0.857, 0, 0.714, 0)}
                    Position={new UDim2(0.0714, 0, 0.0714, 0)}
                    BackgroundTransparency={1}
                    Image={image}
                    ImageColor3={Color3.fromRGB(255, 255, 255)}
                    ImageTransparency={disabled ? 0.5 : 0}
                    ScaleType={Enum.ScaleType.Fit}
                />
            </imagebutton>
        </frame>
    );
}
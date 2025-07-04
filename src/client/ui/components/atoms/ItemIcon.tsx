import React from "@rbxts/react";
import { usePx } from "../../hooks";

export interface ItemIconProps {
    imageId: string;
    size?: number;
    position?: UDim2;
    borderColor?: Color3;
    backgroundColor?: Color3;
}

export function ItemIcon({
    imageId,
    size = 64,
    position,
    borderColor = Color3.fromRGB(200, 200, 200),
    backgroundColor = Color3.fromRGB(50, 50, 50)
}: ItemIconProps) {
    const px = usePx();

    return (
        <frame
            Size={new UDim2(0, px(size), 0, px(size))}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundColor3={backgroundColor}
            BorderSizePixel={px(2)}
            BorderColor3={borderColor}
        >
            <uicorner CornerRadius={new UDim(0, px(8))} />
            <imagebutton
                Size={new UDim2(1, px(-4), 1, px(-4))}
                Position={new UDim2(0, px(2), 0, px(2))}
                Image={imageId}
                BackgroundTransparency={1}
                ScaleType={Enum.ScaleType.Fit}
            />
        </frame>
    );
}

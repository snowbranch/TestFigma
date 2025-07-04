import React from "@rbxts/react";
import { usePx } from "../../hooks";

export interface ButtonProps {
    text: string;
    onClick?: () => void;
    size?: UDim2;
    position?: UDim2;
    backgroundColor?: Color3;
    textColor?: Color3;
    fontSize?: number;
}

export function Button({
    text,
    onClick,
    size,
    position,
    backgroundColor = Color3.fromRGB(45, 85, 255),
    textColor = Color3.fromRGB(255, 255, 255),
    fontSize = 14
}: ButtonProps) {
    const px = usePx();

    return (
        <textbutton
            Text={text}
            Size={size || new UDim2(0, px(120), 0, px(40))}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundColor3={backgroundColor}
            TextColor3={textColor}
            TextSize={px(fontSize)}
            Font={Enum.Font.GothamMedium}
            Event={{
                MouseButton1Click: onClick
            }}
        >
            <uicorner CornerRadius={new UDim(0, px(8))} />
        </textbutton>
    );
}

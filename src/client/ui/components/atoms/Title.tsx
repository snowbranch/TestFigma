import React from "@rbxts/react";
import { usePx } from "../../hooks";

export interface TitleProps {
    text: string;
    size?: UDim2;
    position?: UDim2;
    textColor?: Color3;
    fontSize?: number;
    textAlignment?: Enum.TextXAlignment;
}

export function Title({
    text,
    size,
    position,
    textColor = Color3.fromRGB(255, 255, 255),
    fontSize = 18,
    textAlignment = Enum.TextXAlignment.Center
}: TitleProps) {
    const px = usePx();

    return (
        <textlabel
            Text={text}
            Size={size || new UDim2(1, 0, 0, px(30))}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundTransparency={1}
            TextColor3={textColor}
            TextSize={px(fontSize)}
            TextXAlignment={textAlignment}
            Font={Enum.Font.GothamBold}
        />
    );
}

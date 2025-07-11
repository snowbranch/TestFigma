import React from "@rbxts/react";

interface InfoPanelProps {
    backgroundColor?: Color3;
    cornerRadius?: number;
    content?: string;
}

export function InfoPanel({ 
    backgroundColor = Color3.fromRGB(80, 80, 80),
    cornerRadius = 6,
    content
}: InfoPanelProps) {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundColor3={backgroundColor}
            BorderSizePixel={0}
        >
            <uicorner CornerRadius={new UDim(0, cornerRadius)} />
            {content !== undefined && (
                <textlabel
                    Text={content}
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundTransparency={1}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextSize={18}
                    Font={Enum.Font.Gotham}
                    TextXAlignment={Enum.TextXAlignment.Center}
                    TextYAlignment={Enum.TextYAlignment.Center}
                />
            )}
        </frame>
    );
}

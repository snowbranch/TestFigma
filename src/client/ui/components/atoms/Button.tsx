import React from "@rbxts/react";

interface ButtonProps {
    onPress?: () => void;
    text?: string;
    selected?: boolean;
    disabled?: boolean;
}

export function Button({ onPress, text = "确认", selected = false, disabled = false }: ButtonProps) {
    return (
        <frame
            Size={new UDim2(1, 0, 1, 0)}
            BackgroundTransparency={1}
        >
            <frame
                Size={new UDim2(1, 0, 1, 0)}
                BackgroundColor3={Color3.fromRGB(24, 19, 30)}
                BorderSizePixel={3}
                BorderColor3={Color3.fromRGB(140, 140, 140)}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
                
                <textbutton
                    Size={new UDim2(0.946, 0, 0.8, 0)}
                    Position={new UDim2(0.027, 0, 0.1, 0)}
                    Text=""
                    BorderSizePixel={0}
                    BackgroundTransparency={1}
                    Active={!disabled}
                    Event={{
                        MouseButton1Click: disabled ? undefined : onPress
                    }}
                >
                    <frame
                        Size={new UDim2(1, 0, 1, 0)}
                        BackgroundColor3={Color3.fromRGB(246, 249, 248)}
                        BorderSizePixel={0}
                        BackgroundTransparency={disabled ? 0.5 : 0}
                    >
                        <uicorner CornerRadius={new UDim(0, 3)} />
                        <uigradient
                            Color={new ColorSequence([
                                new ColorSequenceKeypoint(0, Color3.fromRGB(246, 249, 248)),
                                new ColorSequenceKeypoint(1, Color3.fromRGB(220, 220, 220))
                            ])}
                            Rotation={45}
                        />
                    </frame>
                    
                    <textlabel
                        Text={text}
                        Size={new UDim2(1, 0, 1, 0)}
                        BackgroundTransparency={1}
                        TextColor3={disabled ? Color3.fromRGB(100, 100, 100) : Color3.fromRGB(50, 50, 50)}
                        TextSize={30}
                        Font={Enum.Font.GothamMedium}
                        TextXAlignment={Enum.TextXAlignment.Center}
                        TextYAlignment={Enum.TextYAlignment.Center}
                    />
                </textbutton>
            </frame>
        </frame>
    );
}
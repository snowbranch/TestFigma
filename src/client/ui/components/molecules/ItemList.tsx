import React from "@rbxts/react";
import { usePx } from "../../hooks";
import { ItemIcon } from "../atoms";

export interface ItemData {
    id: string;
    imageId: string;
    name: string;
}

export interface ItemListProps {
    items: ItemData[];
    position?: UDim2;
    spacing?: number;
}

export function ItemList({
    items,
    position,
    spacing = 20
}: ItemListProps) {
    const px = usePx();

    return (
        <frame
            Size={new UDim2(1, 0, 0, px(80))}
            Position={position || new UDim2(0, 0, 0, 0)}
            BackgroundTransparency={1}
        >
            <uilistlayout
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                Padding={new UDim(0, px(spacing))}
            />
            {items.map((item, index) => (
                <ItemIcon
                    key={item.id}
                    imageId={item.imageId}
                    size={64}
                />
            ))}
        </frame>
    );
}
